import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from '../../config';

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
