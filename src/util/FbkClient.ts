import { Client, ClientOptions, Collection } from 'discord.js';
import { join } from 'path';
import { readdirSync } from 'fs';
import discordCommands from '../commands/utils';

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
    const eventsPath = join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath).filter((file) =>
      file.endsWith('.ts'),
    );

    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const event = require(filePath).default;
      if (event.once) {
        super.once(event.name, (...args) => event.execute(...args));
      } else {
        super.on(event.name, (...args) => event.execute(...args));
      }
    }
  }
}
