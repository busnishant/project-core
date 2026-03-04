// cmds/vibe.js
// Shows current mode for this user.

import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { getMode } from '../mind/tone.js';
import { handleError } from '../util/errs.js';

export const data = new SlashCommandBuilder()
    .setName('vibe')
    .setDescription('Check which personality mode Aaradhya is currently using for you.');

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const activeMode = getMode(interaction.user.id);
        const msgs = {
            base: "I'm just my normal self right now 😊",
            calm: "I'm in calm mode. Just taking it slow today.",
            sass: "Full sass mode activated. Don't test me 😂",
            hype: "HYPE MODE! Let's gooooo! 🎉"
        };

        const replyText = msgs[activeMode] || `Currently on **${activeMode}** mode.`;
        await interaction.editReply(replyText);
    } catch (err) {
        await handleError(err, interaction, 'vibe');
    }
}
