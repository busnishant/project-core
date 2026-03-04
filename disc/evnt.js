// listens for mentions, replies, and DMs
// add new triggers here if needed

import { Events, ChannelType } from 'discord.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from '../data/logs.js';
import { handleError, handleMessageError } from '../util/errs.js';
import { askAI } from '../mind/chat.js';
import { getHistory, pushHistory } from '../mind/memo.js';
import { getMaskPrompt } from '../mind/tone.js';
import { formatReply, cleanMention } from '../util/frmt.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONF_FILE = join(__dirname, '..', 'conf', 'bott.json');

// ── Dedup: tracks message IDs already handled this cycle ─────────────────────
const processedMessages = new Set();
// Clear every 10 minutes to prevent unbounded memory growth
setInterval(() => processedMessages.clear(), 600_000);

/** Read config flags from bott.json. Safe defaults on parse failure. */
function getConfig() {
    try {
        const cfg = JSON.parse(readFileSync(CONF_FILE, 'utf-8'));
        return {
            mention: cfg.replyOnMention !== false,
            reply: cfg.replyOnReply !== false,
            dm: cfg.replyOnDM !== false,
            autoChannel: cfg.autoChannel ?? null,
        };
    } catch {
        return { mention: true, reply: true, dm: true, autoChannel: null };
    }
}

/**
 * Core message reply handler — shared by all three trigger cases.
 * Loads persona + history, calls AI, saves result, sends reply.
 * @param {import('discord.js').Message} message
 * @param {string} cleanText - Pre-cleaned user text (mention stripped if needed)
 */
async function handleMessageReply(message, cleanText) {
    const userId = message.author.id;

    const systemPrompt = getMaskPrompt(userId);
    const history = getHistory(userId);
    const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: cleanText },
    ];

    // Typing indicator so Aaradhya feels alive while AI is thinking
    await message.channel.sendTyping();

    const reply = await askAI(messages);

    pushHistory(userId, 'user', cleanText);
    pushHistory(userId, 'assistant', reply);

    const chunks = formatReply(reply);
    await message.reply(chunks[0]);
    for (let i = 1; i < chunks.length; i++) {
        await message.channel.send(chunks[i]);
    }
}

/**
 * Attach all event listeners to the Discord client.
 * @param {import('discord.js').Client} client
 */
export function registerEvents(client) {
    // ─── Bot ready ───────────────────────────────────────────────────
    client.once(Events.ClientReady, (c) => {
        log.info('evnt', `Online as ${c.user.tag} · ${c.guilds.cache.size} guild${c.guilds.cache.size !== 1 ? 's' : ''}`);
    });

    // ─── Slash command interactions ──────────────────────────────────
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            log.warn('evnt', `Unknown command: /${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (err) {
            await handleError(err, interaction, interaction.commandName);
        }
    });

    // ─── Message triggers (mention / reply / DM) ──────────────────────────
    client.on(Events.MessageCreate, async (message) => {
        // Always ignore bots and empty messages
        if (message.author.bot) return;
        if (!message.content?.trim()) return;

        // ── Dedup guard ───────────────────────────────────────────────
        // without this it fires twice, no idea why
        if (processedMessages.has(message.id)) return;
        processedMessages.add(message.id);

        const cfg = getConfig();
        const botId = client.user.id;
        const isDM = message.channel.type === ChannelType.DM;

        // ── autoChannel filter (guild only, DMs bypass this) ─────────
        if (!isDM && cfg.autoChannel && message.channelId !== cfg.autoChannel) return;

        const isMention = message.mentions.has(client.user);
        const isReply = !!(
            message.reference?.messageId &&
            (await message.channel.messages.fetch(message.reference.messageId)
                .catch(() => null))?.author?.id === botId
        );

        let trigger = null;

        if (isDM && cfg.dm) {
            trigger = 'dm';
        } else if (isMention && cfg.mention) {
            trigger = 'mention';
        } else if (isReply && cfg.reply) {
            trigger = 'reply';
        }

        if (!trigger) return;

        // Strip the bot mention before sending to AI
        const cleanText = cleanMention(message.content, botId);
        if (!cleanText) return;

        log.info('evnt', `${trigger.padEnd(7)} ← ${message.author.username}`);

        try {
            await handleMessageReply(message, cleanText);
        } catch (err) {
            await handleMessageError(err, message, `evnt:${trigger}`);
        }
    });
}
