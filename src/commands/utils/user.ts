import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription(
      'Provides information about the user who called a slash command.',
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${
        (interaction.member as GuildMember).joinedAt
      }.`,
    );
  },
};
