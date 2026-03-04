// util/prse.js
// Sanitizes and extracts user input from Discord slash command interactions.

/**
 * Extract a named string option from an interaction, with optional trimming.
 * Returns an empty string if the option is missing.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {string} name - Option name as defined in the command builder
 * @returns {string}
 */
export function getOption(interaction, name) {
    const value = interaction.options.getString(name) ?? '';
    return value.trim();
}

/**
 * Sanitize a raw string — collapses whitespace, strips null bytes.
 * Caps at maxLen characters (default 1000).
 * @param {string} raw
 * @param {number} maxLen
 * @returns {string}
 */
export function sanitize(raw = '', maxLen = 1000) {
    return raw
        .replace(/\0/g, '')          // remove null bytes
        .replace(/\s+/g, ' ')        // collapse whitespace
        .trim()
        .slice(0, maxLen);
}
