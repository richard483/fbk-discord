import { GatewayIntentBits } from 'discord.js';
import { config } from './config';
import FbkClient from './util/fbk-client';

const client = new FbkClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.loadCommands();
client.loadEvents();

client.login(config.DISCORD_TOKEN);
