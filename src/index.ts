import { GatewayIntentBits } from 'discord.js';
import { config } from './config';
import FbkClient from './util/fbk-client';
import express from 'express';

const app = express();
const client = new FbkClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.loadCommands();
client.loadEvents();

app.get('/', (res: any) => {
  res.send('Hello from the web server!');
});

app.listen(config.PORT, () => {
  console.log('Kon kon kitsune~');
});

client.login(config.DISCORD_TOKEN);
