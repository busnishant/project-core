// core/envs.js
// Loads environment variables from .env using dotenv.
// Validates required keys are present and throws early if any are missing.

import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadEnv() {
    config({ path: join(__dirname, '..', '.env') });

    const required = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID', 'OPENROUTER_API_KEY'];
    const missing = required.filter(k => !process.env[k]);

    if (missing.length) {
        throw new Error(`[envs] Missing required environment variables: ${missing.join(', ')}`);
    }
}
