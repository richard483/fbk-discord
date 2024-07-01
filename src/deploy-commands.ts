import { REST, Routes } from 'discord.js';
import { config } from './config';
import discordCommands from './commands';
const commands: any[] = [];

discordCommands.forEach((command) => {
  const commandInstance = command.prototype.getInstance();
  commands.push(commandInstance.data.toJSON());
});

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
