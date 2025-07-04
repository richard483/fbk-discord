import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { config } from '../../config';
import axiosRetry from 'axios-retry';
import { DiscordCommand } from '../discord-command';

export class ResetCommand implements DiscordCommand {
  public data: SlashCommandBuilder;
  private self: ResetCommand | undefined;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('reset')
      .setDescription('Reset all chat session');
  }

  public getInstance(): DiscordCommand {
    if (!this.self) {
      this.self = new ResetCommand();
    }
    return this.self;
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
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
      await axios.get(
        String(config.API_HOST + config.DISCORD_LLM_PROVIDER + '/reset'),
      );
      await interaction.editReply('Done reset chat session');
    } catch (e) {
      console.error(e);
      await interaction.editReply("There's some API error");
    }
  }
}
