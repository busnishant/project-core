// cmds/mode.js
// /mode [base|calm|sass|hype] — switches the user's AI persona.

import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { setMode, VALID_MODES } from '../mind/tone.js';
import { getOption } from '../util/prse.js';
import { handleError } from '../util/errs.js';
import { log } from '../data/logs.js';

// In-character confirmation lines — one per mode
const MODE_REPLIES = {
    base: "back to normal 😊 what's up?",
    calm: "okay, i'm here. take your time.",
    sass: "alright, don't say i didn't warn you 😂",
    hype: "let's gooo — tell me something good!",
};

export const data = new SlashCommandBuilder()
    .setName('mode')
    .setDescription('Switch how Aaradhya responds')
    .addStringOption(opt =>
        opt.setName('persona')
            .setDescription('Choose a mode')
            .setRequired(true)
            .addChoices(
                { name: 'base — default, normal, warm, casual', value: 'base' },
                { name: 'calm — slower, softer, present', value: 'calm' },
                { name: 'sass — dry humor, light teasing', value: 'sass' },
                { name: 'hype — genuinely excited, celebrating', value: 'hype' },
            )
    );

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const userId = interaction.user.id;
        const persona = getOption(interaction, 'persona');
        log.info('cmd', `/mode ← ${interaction.user.username} · ${persona}`);

        setMode(userId, persona);

        const reply = MODE_REPLIES[persona] ?? 'mode switched.';
        await interaction.editReply({ content: reply });
    } catch (err) {
        await handleError(err, interaction, 'mode');
    }
}
