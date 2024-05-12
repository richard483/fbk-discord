import { Events } from 'discord.js';
import { config } from '../config';
import helper from '../util/helper';
import axios from 'axios';

export default {
  name: Events.MessageCreate,
  async execute(interaction: any) {
    if (
      interaction.mentions.repliedUser?.id != config.DISCORD_CLIENT_ID &&
      !helper.isCallingBot(interaction.content) &&
      !interaction.mentions?.users.has(config.DISCORD_CLIENT_ID)
    )
      return;
    var q = interaction.content?.replace('beb, ', '');
    q = q.replace(/<[^>]*>/g, '');

    try {
      const answer = await axios.post(String(config.API_HOST + 'gemini/chat'), {
        text: q,
      });
      await interaction.reply(answer.data.data.response);
    } catch (e) {
      console.error(`Error when executing axios : ${e}`);
      await interaction.react('😵');
    }
  },
};
