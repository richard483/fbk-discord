import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from '../../config';
import axiosRetry from 'axios-retry';

export default {
  data: new SlashCommandBuilder()
    .setName('prompt')
    .setDescription('Replies your question with GeminiPro basic model')
    .addStringOption((option) => {
      return option
        .setName('question')
        .setDescription('Your question')
        .setRequired(true);
    }),
  async execute(interaction: any) {
    await interaction.deferReply();
    const question = interaction.options.getString('question');
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
      const answer = await axios.post(
        String(config.API_HOST + 'gemini/prompt-text'),
        {
          text: question,
        },
      );
      await interaction.editReply(answer.data.data.response);
    } catch (e) {
      console.error(e);
      await interaction.editReply("There's some API error");
    }
  },
};
