// cmds/askk.js
// /ask [prompt] — sends a prompt to OpenRouter using the user's active persona
// and conversation history. Replies in chunked messages if needed.

import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { askAI } from '../mind/chat.js';
import { getHistory, pushHistory } from '../mind/memo.js';
import { getMaskPrompt } from '../mind/tone.js';
import { getOption, sanitize } from '../util/prse.js';
import { formatReply } from '../util/frmt.js';
import { handleError } from '../util/errs.js';
import { log } from '../data/logs.js';

export const data = new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask the AI anything')
    .addStringOption(opt =>
        opt.setName('prompt')
            .setDescription('Your question or message')
            .setRequired(true)
    );

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
        const userId = interaction.user.id;
        log.info('cmd', `/ask ← ${interaction.user.username}`);
        const raw = getOption(interaction, 'prompt');
        const prompt = sanitize(raw);

        if (!prompt) {
            await interaction.editReply('❌ Please provide a non-empty prompt.');
            return;
        }

        // Build messages array: system prompt + history + current user message
        const systemPrompt = getMaskPrompt(userId);
        const history = getHistory(userId);
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: prompt },
        ];

        const reply = await askAI(messages);

        // Save user message and assistant reply to history
        pushHistory(userId, 'user', prompt);
        pushHistory(userId, 'assistant', reply);

        const chunks = formatReply(reply);
        await interaction.editReply(chunks[0]);
        for (let i = 1; i < chunks.length; i++) {
            await interaction.followUp(chunks[i]);
        }
    } catch (err) {
        await handleError(err, interaction, 'askk');
    }
}
