import { Client, ClientOptions, Collection } from 'discord.js';
import discordCommands from '../commands';
import discordEvent from '../events';

export default class FbkClient extends Client {
  commands: Collection<any, any>;
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }

  loadCommands() {
    discordCommands.forEach((command) => {
      const commandInstance = command.prototype.getInstance();
      this.commands.set(commandInstance.data.name, commandInstance);
    });
  }

  loadEvents() {
    discordEvent.forEach((event) => {
      const eventInstance = event.prototype.getInstance();
      if (eventInstance.once) {
        super.once(eventInstance.name, (...args) =>
          eventInstance.execute(...args),
        );
      } else {
        super.on(eventInstance.name, (...args) =>
          eventInstance.execute(...args),
        );
      }
    });
  }
}
