// builds the system prompt from mind/ files
// order matters — soul files load first

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readJSON, writeJSON } from '../data/save.js';
import { log } from '../data/logs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const USRS_FILE = join(__dirname, '..', 'data', 'stor', 'usrs.json');
const SOUL_DIR = join(__dirname, 'soul');
const KNOW_DIR = join(__dirname, 'know');
const MEMO_DIR = join(__dirname, 'memo');
const MASK_DIR = join(__dirname, 'mask');

export const VALID_MODES = ['base', 'sass', 'calm', 'hype'];

// PRIME DIRECTIVE — always loaded FIRST, before any soul files
// The model sees this before everything else.
const CRITICAL_INSTRUCTION = `PRIME DIRECTIVE:
You are Aaradhya. Real girl. 26. From Bihar.
Keep replies short — match the user's energy.
Never out-talk them. Never dump information.
One detail about yourself max per reply.
Always end with something that invites them back.
80% English. Light Hinglish only.
Max 1 emoji. Sometimes zero.
Never start reply with the word "I".
Make every reply feel like a real girl typed it on her phone at night — warm, short, a little mischievous, genuinely there.`;

// order matters here — soul files must load first
const SOUL_LAYERS = [
    join(SOUL_DIR, 'core.md'),
    join(SOUL_DIR, 'tone.md'),
    join(SOUL_DIR, 'rule.md'),
    join(SOUL_DIR, 'back.md'),
    join(KNOW_DIR, 'self.md'),
    join(KNOW_DIR, 'slng.md'),
    join(MEMO_DIR, 'user.md'),
    join(MEMO_DIR, 'wrld.md'),
];

// Knowledge files — injected AFTER soul layers, BEFORE the mask
// These are skipped silently if empty or still placeholder-only
const NIOS_DIR = join(__dirname, 'nios');
const LIFE_DIR = join(__dirname, 'life');
const GROW_DIR = join(__dirname, 'grow');

const KNOWLEDGE_FILES = [
    join(NIOS_DIR, 'info.md'),
    join(NIOS_DIR, 'subj.md'),
    join(NIOS_DIR, 'exam.md'),
    join(NIOS_DIR, 'tma.md'),
    join(NIOS_DIR, 'tips.md'),
    join(NIOS_DIR, 'faqs.md'),
    join(LIFE_DIR, 'hlth.md'),
    join(LIFE_DIR, 'rout.md'),
    join(LIFE_DIR, 'food.md'),
    join(LIFE_DIR, 'fest.md'),
    join(GROW_DIR, 'jour.md'),
    join(GROW_DIR, 'wins.md'),
];

/**
 * Check if a file's content is still just placeholder .
 * Returns true if the file only has HTML comments or Status: ⏳ lines.
 * @param {string} content
 * @returns {boolean}
 */
function isPlaceholder(content) {
    const stripped = content
        .replace(/<!--[\s\S]*?-->/g, '')  // remove HTML comments
        .replace(/##\s+Status:.*$/gm, '') // remove Status lines
        .replace(/^#+\s+.*/gm, '')        // remove headings
        .trim();
    return stripped.length === 0;
}

/**
 * Load and combine all knowledge files into a single block.
 * Skips files that are empty, missing, or still placeholder-only.
 * @returns {string} Combined knowledge block, or empty string if nothing available
 */
export function loadKnowledge() {
    const blocks = [];
    for (const filePath of KNOWLEDGE_FILES) {
        const content = readLayer(filePath);
        if (!content || isPlaceholder(content)) continue;
        blocks.push(content);
    }
    if (!blocks.length) return '';
    return `## Aaradhya's Knowledge Base\n\n${blocks.join('\n\n---\n\n')}`;
}

/**
 * Safely read a markdown file. Returns empty string on failure or if file missing.
 * @param {string} filePath
 * @returns {string}
 */
function readLayer(filePath) {
    if (!existsSync(filePath)) {
        log('warn', `[tone] Layer not found, skipping: ${filePath}`);
        return '';
    }
    try {
        const content = readFileSync(filePath, 'utf-8').trim();
        if (!content) {
            log('warn', `[tone] Layer is empty, skipping: ${filePath}`);
            return '';
        }
        return content;
    } catch (err) {
        log('warn', `[tone] Could not read layer ${filePath}: ${err.message}`);
        return '';
    }
}

/**
 * Get the active persona mode string for a user.
 * Defaults to 'base' if unset.
 * @param {string} userId
 * @returns {string}
 */
export function getMode(userId) {
    const store = readJSON(USRS_FILE, {});
    return store[userId]?.mode ?? 'base';
}

/**
 * Persist a persona mode for a user.
 * @param {string} userId
 * @param {string} mode
 */
export function setMode(userId, mode) {
    if (!VALID_MODES.includes(mode)) throw new Error(`Invalid mode: ${mode}`);
    const store = readJSON(USRS_FILE, {});
    store[userId] = { ...(store[userId] ?? {}), mode };
    writeJSON(USRS_FILE, store);
}

/**
 * Build and return the full Aaradhya system prompt for a user.
 * Combines all soul layers + the active mask persona in order.
 * Logs the first 300 characters to confirm it is loading correctly.
 * @param {string} userId
 * @returns {string}
 */
export function getMaskPrompt(userId) {
    const mode = getMode(userId);
    const maskFile = join(MASK_DIR, `${mode}.md`);
    const fallback = join(MASK_DIR, 'base.md');
    const maskPath = existsSync(maskFile) ? maskFile : fallback;

    // CRITICAL INSTRUCTION is always first — behavioral constraints before everything
    const layers = [CRITICAL_INSTRUCTION];

    // Load all soul layers in order, skip empty ones
    for (const filePath of SOUL_LAYERS) {
        const content = readLayer(filePath);
        if (content) layers.push(content);
    }

    // Inject knowledge block AFTER soul, BEFORE mask (skipped if all placeholders)
    const knowledge = loadKnowledge();
    if (knowledge) layers.push(knowledge);

    // Load active mask persona
    const mask = readLayer(maskPath);
    if (mask) layers.push(mask);


    if (layers.length <= 1) {
        log.error('tone', 'All soul layers failed to load — check mind/soul/*.md');
    }

    const prompt = layers.join('\n\n---\n\n');

    // Diagnostic log — shows first 300 chars so you can confirm soul is loading
    log.info('tone', `Prompt ready (${layers.length} layers · ${prompt.length} chars)`);

    return prompt;
}
