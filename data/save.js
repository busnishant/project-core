// read/write helper for JSON files
// all paths are absolute — don't change this

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { basename } from 'path';
import { log } from './logs.js';

/**
 * Read a JSON file and return its parsed contents.
 * Returns a default value if the file doesn't exist or is malformed.
 * @param {string} absPath - Absolute path to the JSON file
 * @param {*} fallback - Returned when file is missing or unparseable
 */
export function readJSON(absPath, fallback = {}) {
    try {
        if (!existsSync(absPath)) return fallback;
        const raw = readFileSync(absPath, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        log.error('data', `Read failed — ${basename(absPath)}: ${err.message}`);
        return fallback;
    }
}

/**
 * Write data to a JSON file, pretty-printed.
 * @param {string} absPath - Absolute path to the JSON file
 * @param {*} data - Serialisable JS value
 */
// always use absolute paths here or it breaks
// on Railway — learned this the hard way
export function writeJSON(absPath, data) {
    try {
        writeFileSync(absPath, JSON.stringify(data, null, 2), 'utf-8');
        log.debug('data', `Saved ${basename(absPath)}`);
    } catch (err) {
        log.error('data', `Write failed — ${basename(absPath)}: ${err.message}`);
        throw err;
    }
}
