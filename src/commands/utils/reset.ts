import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from '../../config';
import axiosRetry from 'axios-retry';

export default {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset all chat session'),
  async execute(interaction: any) {
    await interaction.deferReply();
    try {
      axiosRetry(axios, {
        retries: Number(config.NUMBER_OF_API_RETRY),
        retryDelay: (count) => {
          console.log('[RETRY API CALL] Retry attempt: ', count);
          return count * Number(config.TIME_TO_REPLY);
        },
        retryCondition: (error) => {
          return (
            error.response?.status === 503 || error.response?.status === 524
          );
        },
      });
      await axios.get(String(config.API_HOST + 'gemini/reset'));
      await interaction.editReply('Done reset chat session');
    } catch (e) {
      console.error(e);
      await interaction.editReply("There's some API error");
    }
  },
};
