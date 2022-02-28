import { Client, Intents, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';



// Librerias usuario
import config from './config';
import './database'


const main = async () => {
    const client = new Client({
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
			Intents.FLAGS.GUILD_INVITES,
			Intents.FLAGS.GUILD_VOICE_STATES,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		],
	});
	
	// MANIPULADOR DE COMANDOS
	const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
	const commands = [];
	client.commands = new Collection();
	// CREACION DE EL ARRAY DE COMANDOS A REGISTRAR
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);

		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	}

	// CUANDO YA ESTA LOGEADO EL BOT EN DISCORD SE EJECUTA EL CODIGO
    client.once("ready", async () => {

		// SETEA EL ESTADO DEL BOT 
		console.log("tamos Ready!");
		await client.user.setActivity({
			type: "LISTENING",
			name: "Ser productivo",
		});
		
		// REGISTRO DE LOS COMANDOS
		const CLIENT_ID = client.user.id;
		const rest = new REST({
			version:"9",
		}).setToken(config.BOTOKEN);
		
		(async () => {
			try {
				if(config.ENV == "production"){
					await rest.put(Routes.applicationCommand(CLIENT_ID), {
						body: commands
					});
					console.log("comandos registrados exitosamente de manera global")
					
				}else{
					await rest.put(Routes.applicationGuildCommands(CLIENT_ID,config.GUILD_ID), {
						body: commands
					});
					console.log("comandos registrados exitosamente de manera local")
				}
			} catch (error) {
				if(error)console.error(error);
			}
		})();

		// REINICIO DE LOS EVENTOS DEL BOT
		/* if (!(client.user?.tag === "SpongeBob#9136")) {
			await deleteAllGroups();

			let membersWorking = await UserWorkingModel.find({});

			membersWorking.forEach((user) => {
				if (user.guildId) {
					console.log(user);
					updateDatabase(
						user.guildId,
						user.discordId,
						user.discordTag,
						user.minutes
					);
					deleteUserWorking(user.discordId);
				}
			});

			await deleteAllCanceled();
			await deleteUsersOnBreak();
			await deleteGroupsBreak();
		 }*/
	});
	
	client.on("interactionCreate", async (interaction) => {
	 	
		if(!interaction.isCommand())return;
		const command = client.commands.get(interaction.commandName)
		if(!command)return;

		try {

			await command.execute(interaction);

			// if (interaction.isButton()) {
			// 	const { customId } = interaction;
			// 	console.log(customId);
			// 	if (customId === "pomodoro") {
			// 		await client.commands.get(customId).execute(interaction, {
			// 			work: 25,
			// 			rest: 0,
			// 			error: { pom: "", rest: "" },
			// 		});
			// 	} else if (customId === "group") {
			// 		await client.commands.get(customId).execute(interaction, {
			// 			work: 25,
			// 			rest: 0,
			// 			error: { pom: "", rest: "" },
			// 		});
			// 	} else {
			// 		await client.commands.get(customId).execute(interaction);
			// 	}
			// }

			// if (interaction.isCommand()) {
			// 	const { commandName } = interaction;
			// 	if (!client.commands.has(commandName)) return;

			// 	try {
			// 		await client.commands.get(commandName).execute(interaction);
			// 	} catch (error) {
			// 		console.error(error);
			// 		return interaction.reply({
			// 		content: "There was an error while executing this command!",
			// 		ephemeral: true,
			// 		});
			// 	}
			// }
		} catch(err) {
			if(err)console.log(err);

			await interaction.reply({
				content:"ha ocurrido un error mientras de intenta ejecutar el comando",
				emphemeral:true
			})
		}
    });



	// LOGIN DEL BOT
	client.login(config.BOTOKEN);
}

main();