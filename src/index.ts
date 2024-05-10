import { Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import FbkClient from "./util/FbkClient";

const client = new FbkClient({ intents: [GatewayIntentBits.Guilds] })

client.loadCommands()

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = (interaction.client as FbkClient).commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.once(Events.ClientReady, (readyClient) => {
	console.log("Logged in as", readyClient.user?.tag)
})

client.login(config.DISCORD_TOKEN)