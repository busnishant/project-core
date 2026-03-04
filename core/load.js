// core/load.js
// Bootstrap sequence — wires together client, commands, and events in order.
// Called once from boot.js before logging in.

import { client } from '../disc/clnt.js';
import { registerCommands } from '../disc/regs.js';
import { registerEvents } from '../disc/evnt.js';
import { log } from '../data/logs.js';

/**
 * Sequential bootstrap:
 * 1. Register all slash command modules
 * 2. Attach event listeners
 * @returns {import('discord.js').Client}
 */
export async function bootstrap() {
    log.info('load', 'Loading commands...');
    await registerCommands(client);

    log.info('load', 'Registering events...');
    registerEvents(client);

    log.info('load', 'Bootstrap complete');
    return client;
}
