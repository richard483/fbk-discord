import { ChatInputCommandInteraction, Events } from 'discord.js';
import FbkClient from '../../util/fbk-client';
import { DiscordCommand } from '../../commands/discord-command';
import { DiscordEvent } from '../discord-event';

export class InteractionCreateEvent implements DiscordEvent {
  public name: string;
  private self: DiscordEvent | undefined;

  constructor() {
    this.name = Events.InteractionCreate;
  }

  public getInstance(): DiscordEvent {
    if (!this.self) {
      this.self = new InteractionCreateEvent();
    }
    return this.self;
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;
    const command: DiscordCommand | undefined = (
      interaction.client as FbkClient
    ).commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  }
}
