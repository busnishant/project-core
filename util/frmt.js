// util/frmt.js
// Text utilities for formatting and cleaning Discord messages.

/**
 * Trim whitespace from a string and split it into Discord-safe chunks.
 * Each chunk is at most 2000 characters. Splits on newlines where possible.
 * @param {string} text - Raw AI reply
 * @returns {string[]} Array of safe message chunks
 */
export function formatReply(text = '') {
    const cleaned = text.trim();
    if (!cleaned) return ['*(No response)*'];
    if (cleaned.length <= 2000) return [cleaned];

    // Try to split on double newlines first, then single, then hard-cut
    const chunks = [];
    let remaining = cleaned;
    while (remaining.length > 2000) {
        let splitAt = remaining.lastIndexOf('\n\n', 2000);
        if (splitAt <= 0) splitAt = remaining.lastIndexOf('\n', 2000);
        if (splitAt <= 0) splitAt = 2000;
        chunks.push(remaining.slice(0, splitAt).trim());
        remaining = remaining.slice(splitAt).trim();
    }
    if (remaining.length) chunks.push(remaining);
    return chunks;
}

/**
 * Strip bot mention tags from a message's raw content.
 * Handles both <@BOT_ID> and <@!BOT_ID> (nickname mention) forms.
 * @param {string} content - Raw message content from Discord
 * @param {string} botId   - The bot's user ID
 * @returns {string} Clean text with mention removed and whitespace trimmed
 */
export function cleanMention(content = '', botId = '') {
    return content
        .replace(new RegExp(`<@!?${botId}>`, 'g'), '')
        .trim();
}
