// disc/regs.js
// Auto-discovers and registers all slash commands from cmds/*.js
// by walking the cmds directory and loading each module's { data, execute }.

import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { log } from '../data/logs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CMDS_DIR = join(__dirname, '..', 'cmds');

/**
 * Load all command modules into client.commands.
 * Each file must export `data` (SlashCommandBuilder) and `execute` (async fn).
 * @param {import('discord.js').Client} client
 */
export async function registerCommands(client) {
    const files = readdirSync(CMDS_DIR).filter(f => f.endsWith('.js'));
    let count = 0;

    for (const file of files) {
        const filePath = pathToFileURL(join(CMDS_DIR, file)).href;
        try {
            const cmd = await import(filePath);
            if (!cmd.data || !cmd.execute) {
                log.warn('regs', `Skipping ${file} — missing data or execute export`);
                continue;
            }
            client.commands.set(cmd.data.name, cmd);
            log.info('regs', `/${cmd.data.name} registered`);
            count++;
        } catch (err) {
            log.error('regs', `Failed to load ${file}: ${err.message}`);
        }
    }

    log.info('load', `${count} command${count !== 1 ? 's' : ''} ready`);
}
