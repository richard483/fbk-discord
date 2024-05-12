import { REST, Routes } from 'discord.js';
import { config } from './config';
import { join } from 'path';
import { readdirSync } from 'fs';
const commands = [];
const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith('.ts'),
  );
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(filePath).default;
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const rest = new REST().setToken(config.DISCORD_TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        config.DISCORD_CLIENT_ID,
        config.GUILD_ID,
      ),
      { body: commands },
    );

    console.log(
      `Successfully reloaded ${
        (data as Array<unknown>).length
      } application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
