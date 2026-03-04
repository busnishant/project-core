// cmds/setup.js
// /setup channel:#channel — designates which channel Aaradhya auto-responds in.
// Saves the channel ID to conf/bott.json under "autoChannel".
// DMs always work regardless of this setting.

import { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } from 'discord.js';
import { readJSON, writeJSON } from '../data/save.js';
import { handleError } from '../util/errs.js';
import { log } from '../data/logs.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONF_FILE = join(__dirname, '..', 'conf', 'bott.json');

export const data = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Pick which channel Aaradhya responds in (server owner only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(opt =>
        opt.setName('channel')
            .setDescription('The channel to use')
            .setRequired(true)
    );

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
export async function execute(interaction) {
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const channel = interaction.options.getChannel('channel', true);
        log.info('cmd', `/setup ← ${interaction.user.username} · #${channel.name}`);

        // Save to bott.json
        const cfg = readJSON(CONF_FILE, {});
        cfg.autoChannel = channel.id;
        writeJSON(CONF_FILE, cfg);

        await interaction.editReply({
            content: `got it — i'll hang out in <#${channel.id}> 😊`,
        });
    } catch (err) {
        await handleError(err, interaction, 'setup');
    }
}
