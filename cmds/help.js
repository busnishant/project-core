// cmds/help.js
// Lists all commands ephemerally.

import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getMode } from '../mind/tone.js';
import { handleError } from '../util/errs.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all commands and see what Aaradhya can do.');

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const activeMode = getMode(interaction.user.id);

        const helpText = `**Aaradhya's Commands:**\n\n`
            + `\`/ask [prompt]\` — Talk to Aaradhya. (Full AI pipeline)\n`
            + `\`/mode [base|calm|sass|hype]\` — Switch her personality mode. You are currently on **${activeMode}** mode.\n`
            + `\`/wipe [msgs] [mem]\` — \`msgs\` to delete Discord messages, \`mem\` to clear your AI chat history.\n`
            + `\`/setup [#channel]\` — Locks Aaradhya to one channel (Admin only).\n`
            + `\`/vibe\` — Shows which personality mode is currently active for you.\n`
            + `\`/help\` — Shows this message.`;

        await interaction.editReply(helpText);
    } catch (err) {
        await handleError(err, interaction, 'help');
    }
}
