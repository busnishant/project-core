// mind/memo.js
// Per-user conversation history stored in data/stor/msgs.json.
// Uses OpenAI message format: role "user"/"assistant", content as a plain string.
// Caps each user's history at maxHistory messages, trimming oldest first.

import { readJSON, writeJSON } from '../data/save.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MSGS_FILE = join(__dirname, '..', 'data', 'stor', 'msgs.json');
const CONF_FILE = join(__dirname, '..', 'conf', 'bott.json');

function getMax() {
    try {
        const cfg = JSON.parse(readFileSync(CONF_FILE, 'utf-8'));
        return cfg.maxHistory ?? 20;
    } catch { return 20; }
}

/**
 * Retrieve the OpenAI-format message history for a user.
 * @param {string} userId
 * @returns {Array<{role:string, content:string}>}
 */
export function getHistory(userId) {
    const store = readJSON(MSGS_FILE, {});
    return store[userId] ?? [];
}

/**
 * Append a message to a user's history in OpenAI format.
 * role must be "user" or "assistant".
 * Trims oldest messages when over the cap.
 * @param {string} userId
 * @param {'user'|'assistant'} role
 * @param {string} content
 */
export function pushHistory(userId, role, content) {
    const store = readJSON(MSGS_FILE, {});
    const max = getMax();
    const history = store[userId] ?? [];
    history.push({ role, content });
    while (history.length > max) history.shift();
    store[userId] = history;
    writeJSON(MSGS_FILE, store);
}

/**
 * Wipe the entire history for a user.
 * @param {string} userId
 */
export function clearHistory(userId) {
    const store = readJSON(MSGS_FILE, {});
    delete store[userId];
    writeJSON(MSGS_FILE, store);
}
