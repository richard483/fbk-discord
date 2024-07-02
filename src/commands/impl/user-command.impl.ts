import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import { DiscordCommand } from '../discord-command';

export class UserCommand implements DiscordCommand {
  public data: SlashCommandOptionsOnlyBuilder;
  private self: UserCommand | undefined;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('user')
      .setDescription(
        'Provides information about the user who called a slash command.',
      );
  }

  public getInstance(): DiscordCommand {
    if (!this.self) {
      this.self = new UserCommand();
    }
    return this.self;
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${
        (interaction.member as GuildMember).joinedAt
      }.`,
    );
  }
}
