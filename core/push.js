// core/push.js
// Deploys slash commands to a specific guild (server) via the Discord REST API.
// Guild commands update instantly — no 1-hour propagation delay.
// Run once with: npm run deploy
//
// Order of operations:
//   1. Wipe all global commands (clears any commands registered globally by mistake)
//   2. Wipe all guild commands (clean slate)
//   3. Register fresh to guild only

import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadEnv } from './envs.js';
import { log } from '../data/logs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;
const CMDS_DIR = join(__dirname, '..', 'cmds');

(async () => {
    // Collect command payloads from cmds/
    const commands = [];
    const files = readdirSync(CMDS_DIR).filter(f => f.endsWith('.js'));
    for (const file of files) {
        const url = pathToFileURL(join(CMDS_DIR, file)).href;
        try {
            const mod = await import(url);
            if (mod.data) commands.push(mod.data.toJSON());
        } catch (err) {
            log.warn('push', `Skipped ${file}: ${err.message}`);
        }
    }

    const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

    // Step 1 — wipe global commands (fixes the duplicate showing in Discord)
    log.info('push', 'Clearing global commands...');
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: [] });
    log.info('push', 'Global commands cleared ✓');

    // Step 2 — wipe guild commands (clean slate before re-registering)
    log.info('push', `Clearing guild commands for ${DISCORD_GUILD_ID}...`);
    await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), { body: [] });
    log.info('push', 'Guild commands cleared ✓');

    // Step 3 — register fresh to guild only
    log.info('push', `Registering ${commands.length} command(s) to guild...`);
    await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), { body: commands });
    log.info('push', 'Guild commands registered successfully ✓ (instant)');
})();
