import { Events } from 'discord.js';
import { config } from '../config';
import helper from '../util/helper';
import axios from 'axios';
import axiosRetry from 'axios-retry';

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
      axiosRetry(axios, {
        retries: Number(config.NUMBER_OF_API_RETRY),
        retryDelay: (count) => {
          console.log('[RETRY API CALL] Retry attempt: ', count);
          return count * Number(config.TIME_TO_REPLY);
        },
        retryCondition: (error) => {
          return Number(error.response?.status).toString().startsWith('5');
        },
      });
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
