import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from '../../config';

export default {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset all chat session'),
  async execute(interaction: any) {
    await interaction.deferReply();
    try {
      const answer = await axios.get(String(config.API_HOST + 'gemini/reset'));
      await interaction.editReply('Done reset chat session');
    } catch (e) {
      console.error(e);
      await interaction.editReply("There's some API error");
    }
  },
};
