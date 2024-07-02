import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import { DiscordCommand } from '../discord-command';

export class ServerCommand implements DiscordCommand {
  public data: SlashCommandOptionsOnlyBuilder;
  private self: ServerCommand | undefined;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('server')
      .setDescription('Provides information about the server.');
  }

  public getInstance(): DiscordCommand {
    if (!this.self) {
      this.self = new ServerCommand();
    }
    return this.self;
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      `This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`,
    );
  }
}

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.'),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      `This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`,
    );
  },
};
