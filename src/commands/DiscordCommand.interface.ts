/* eslint-disable @typescript-eslint/no-namespace */
import {
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface DiscordCommand {
  data: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
  getInstance: () => DiscordCommand;
}
