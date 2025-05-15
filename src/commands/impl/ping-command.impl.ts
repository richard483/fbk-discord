import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import { DiscordCommand } from '../discord-command';

export class PingCommand implements DiscordCommand {
  public data: SlashCommandOptionsOnlyBuilder;
  private self: PingCommand | undefined;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!');
  }

  public getInstance(): DiscordCommand {
    if (!this.self) {
      this.self = new PingCommand();
    }
    return this.self;
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!');
  }
}
