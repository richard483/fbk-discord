import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import axios from 'axios';
import { config } from '../../config';
import axiosRetry from 'axios-retry';
import { DiscordCommand } from '../discord-command';

export class AskCommand implements DiscordCommand {
  public data: SlashCommandOptionsOnlyBuilder;
  private self: DiscordCommand | undefined;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('ask')
      .setDescription(
        'Replies your question with Shirakami Fubuki Personality!',
      )
      .addStringOption((option) => {
        return option
          .setName('question')
          .setDescription('Your question')
          .setRequired(true);
      });
  }

  public getInstance(): DiscordCommand {
    if (!this.self) {
      this.self = new AskCommand();
    }
    return this.self;
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const question = interaction.options.getString('question');
    try {
      axiosRetry(axios, {
        retries: Number(config.NUMBER_OF_API_RETRY),
        retryDelay: (count) => {
          console.log('[RETRY API CALL] Retry attempt: ', count);
          return count * Number(config.TIME_TO_RETRY);
        },
        retryCondition: (error) => {
          return Number(error.response?.status).toString().startsWith('5');
        },
      });
      const answer = await axios.post(
        String(config.API_HOST + config.DISCORD_LLM_PROVIDER + '/chat'),
        {
          text: question,
          model: config.DISCORD_LLM_MODEL,
        },
      );
      await interaction.editReply(answer.data.data.response);
    } catch (e) {
      console.error(e);
      await interaction.editReply("There's some API error");
    }
  }
}
