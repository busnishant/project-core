// data/logs.js
// Production-grade logger — coloured, aligned, timestamped local time.
// API: log.info(tag, msg) | log.warn(tag, msg) | log.error(tag, msg) | log.debug(tag, msg)
// DEBUG lines only print when DEBUG=true in .env

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const DEBUG_ON = process.env.DEBUG === 'true';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = join(__dirname, 'logs');

if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const COLOURS = {
    INFO: '\x1b[32m',  // green
    WARN: '\x1b[33m',  // yellow
    ERROR: '\x1b[31m',  // red
    DEBUG: '\x1b[36m',  // cyan
    RESET: '\x1b[0m',
};

const LEVEL_WIDTH = 5;  // "INFO " / "WARN " / "ERROR" / "DEBUG"
const TAG_WIDTH = 6;  // "boot  " / "evnt  " / "chat  " etc.

/**
 * Format and print a single log line.
 * @param {'INFO'|'WARN'|'ERROR'|'DEBUG'} level
 * @param {string} tag   - Short source tag (boot, evnt, chat...)
 * @param {string} msg   - Log message
 */
function print(level, tag, msg) {
    if (level === 'DEBUG' && !DEBUG_ON) return;

    // Local timestamp — "2026-03-04 09:12:34"
    const ts = new Date().toLocaleString('sv').replace('T', ' ');

    const colour = COLOURS[level] ?? '';
    const lvlStr = level.padEnd(LEVEL_WIDTH);
    const tagStr = tag.padEnd(TAG_WIDTH);

    const consoleLine = `${ts}  ${colour}${lvlStr}${COLOURS.RESET}  ${tagStr}  ${msg}`;
    const fileLine = `${ts}  ${lvlStr}  ${tagStr}  ${msg}\n`;

    const method = level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log';
    console[method](consoleLine);

    // Write to daily file
    try {
        const today = new Date().toISOString().slice(0, 10);
        const LOG_FILE = join(LOGS_DIR, `${today}.log`);
        fs.appendFileSync(LOG_FILE, fileLine, 'utf8');
    } catch (err) {
        // fail silently to avoid terminal loops
    }
}

/**
 * Print the startup header — call once on boot.
 */
export function printStartupBanner() {
    const line = '─'.repeat(42);
    console.log(`\n${line}`);
    console.log(' Aaradhya  ·  Discord Bot  ·  v1.0.0');
    console.log(' Node 18+  ·  discord.js v14');
    console.log(`${line}\n`);
}

/**
 * Logger — use log.info / log.warn / log.error / log.debug
 */
export const log = {
    info: (tag, msg) => print('INFO', tag, msg),
    warn: (tag, msg) => print('WARN', tag, msg),
    error: (tag, msg) => print('ERROR', tag, msg),
    debug: (tag, msg) => print('DEBUG', tag, msg),
};
