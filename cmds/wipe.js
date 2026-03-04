// cmds/wipe.js
// /wipe [msgs] [mem] — two independent options.
//   msgs:True  → delete recent Discord messages (bot + user)
//   mem:True   → clear AI conversation history for this user
//   both True  → do both
//   neither    → explain usage

import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { clearHistory } from '../mind/memo.js';
import { handleError } from '../util/errs.js';
import { log } from '../data/logs.js';

export const data = new SlashCommandBuilder()
    .setName('wipe')
    .setDescription('Delete our recent messages and/or clear your chat memory')
    .addIntegerOption(opt =>
        opt.setName('msgs')
            .setDescription('how many messages to delete (1-100)')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(100)
    )
    .addIntegerOption(opt =>
        opt.setName('mem')
            .setDescription('clear my chat memory? (1 = yes)')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(1)
    );

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const msgs = interaction.options.getInteger('msgs');
        const mem = interaction.options.getInteger('mem');

        log.info('cmd', `/wipe ← ${interaction.user.username} · msgs=${msgs} mem=${mem}`);

        // Neither option given — guide them
        if (!msgs && mem !== 1) {
            return await interaction.editReply({
                content: 'use `/wipe msgs:50` to delete messages\nor `/wipe mem:1` to clear memory\nor both together 😊',
            });
        }

        let count = 0;

        // ── Delete Discord messages ───────────────────────────────────
        if (msgs) {
            const channel = interaction.channel;
            const botId = interaction.client.user.id;
            const userId = interaction.user.id;

            try {
                // Fetch up to the requested amount (max 100)
                const fetched = await channel.messages.fetch({ limit: msgs });
                const toDelete = fetched.filter(m =>
                    m.author.id === botId || m.author.id === userId
                );

                log.info('wipe', `${toDelete.size} messages targeted out of ${msgs} requested`);

                if (toDelete.size > 0) {
                    const result = await channel.bulkDelete(toDelete, true);
                    count = result.size;
                    log.info('wipe', `deleted=${count}`);
                }
            } catch (err) {
                log.error('wipe', err.message);
            }
        }

        // ── Clear AI memory ───────────────────────────────────────────
        if (mem === 1) {
            clearHistory(interaction.user.id);
            log.info('wipe', `memory cleared for user`);
        }

        // ── Reply ─────────────────────────────────────────────────────
        let msg;
        if (msgs && mem === 1) msg = `deleted ${count} messages and cleared memory 👍`;
        else if (msgs) msg = `deleted last ${count} messages 👍`;
        else msg = 'memory cleared 👍';

        await interaction.editReply(msg);

    } catch (err) {
        await handleError(err, interaction, 'wipe');
    }
}
