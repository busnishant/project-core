// disc/clnt.js
// Creates and exports the Discord client with the required Gateway Intents.
// Partials.Channel and Partials.Message are required for DMs to be received.

import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
    ],
    partials: [
        Partials.Channel,  // required to receive DM channel events
        Partials.Message,  // required to receive DM message events
    ],
});

// Attach a commands collection so the event handler can look up commands
client.commands = new Collection();
