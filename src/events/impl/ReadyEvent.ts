import { Client, Events } from 'discord.js';
import { DiscordEvent } from '../DiscordEvent.interface';

export class ReadyEvent implements DiscordEvent {
  public name: string;
  public once: boolean;
  private self: ReadyEvent | undefined;

  constructor() {
    this.name = Events.ClientReady;
    this.once = true;
  }

  public getInstance(): DiscordEvent {
    if (!this.self) {
      this.self = new ReadyEvent();
    }
    return this.self;
  }

  public execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  }
}
