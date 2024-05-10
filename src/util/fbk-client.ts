import { Client, ClientOptions, Collection, Events } from "discord.js";
import { join } from 'path';
import { readdirSync } from 'fs';

export default class FbkClient extends Client {
  commands: Collection<any, any>
  constructor(options: ClientOptions) {
    super(options)
    this.commands = new Collection()
  }

  loadCommands() {
    const folderPath = join(__dirname, '../commands')
    const commandFolder = readdirSync(folderPath)

    for (const folder of commandFolder) {
      const commandsPath = join(folderPath, folder)
      const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'))

      for (const file of commandFiles) {
        const filePath = join(commandsPath, file)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(filePath).default
        if ('data' in command && 'execute' in command) {
          this.commands.set(command.data?.name, command)
        } else {
          console.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`)
        }
      }
    }
  }

  loadEvents() {
    const eventsPath = join(__dirname, '../events')
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event = require(filePath).default;
      if (event.once) {
        super.once(event.name, (...args) => event.execute(...args));
      } else {
        super.on(event.name, (...args) => event.execute(...args));
      }
    }
  }

}