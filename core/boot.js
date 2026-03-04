// entry point — starts everything

import { loadEnv } from './envs.js';
import { bootstrap } from './load.js';
import { log, printStartupBanner } from '../data/logs.js';

// Global error guards — never let the bot die silently
process.on('unhandledRejection', (err) => {
    log.error('boot', `Unhandled rejection: ${err?.message ?? err}`);
});

process.on('uncaughtException', (err) => {
    log.error('boot', `Uncaught exception: ${err.message}`);
    process.exit(1);
});

(async () => {
    try {
        printStartupBanner();
        log.info('boot', 'Starting Aaradhya...');
        loadEnv();
        const client = await bootstrap();
        await client.login(process.env.DISCORD_TOKEN);
    } catch (err) {
        log.error('boot', `Fatal startup error: ${err.message}`);
        process.exit(1);
    }
})();
