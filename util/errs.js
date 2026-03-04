// util/errs.js
// Centralised error handler — logs errors and replies gracefully.
// Works for both slash command interactions and plain message contexts.

import { MessageFlags } from 'discord.js';
import { log } from '../data/logs.js';

/**
 * Handle a slash command interaction error.
 * @param {Error|unknown} err
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {string} context - Short label (e.g. 'ask', 'mode')
 */
export async function handleError(err, interaction, context = 'cmd') {
    const msg = err instanceof Error ? err.message : String(err);
    log.error('err', `${context}: ${msg}`);

    try {
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({
                content: "⚠️ something went wrong — try again in a sec"
            });
        } else {
            await interaction.reply({
                content: "⚠️ something went wrong — try again in a sec",
                flags: MessageFlags.Ephemeral
            });
        }
    } catch (replyErr) {
        log.error('err', `Failed to send error reply for ${context}: ${replyErr.message}`);
    }
}

/**
 * Handle a messageCreate-level error.
 * @param {Error|unknown} err
 * @param {import('discord.js').Message} message
 * @param {string} context - e.g. 'evnt:mention'
 */
export async function handleMessageError(err, message, context = 'evnt') {
    const msg = err instanceof Error ? err.message : String(err);
    log.error('err', `${context}: ${msg}`);

    try {
        await message.reply('something went wrong on my end — try again in a sec.');
    } catch (replyErr) {
        log.error('err', `Fallback reply failed for ${context}: ${replyErr.message}`);
    }
}
