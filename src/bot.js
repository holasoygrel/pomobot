import { Client, Intents, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';

import  { handleMessage } from "./utils/handleMessage";
import  { canStartPomodoro, canStartGroup } from "./utils/canStart";
import  { GuildModel } from "./database/models/Guild";
import  { UserWorkingModel } from "./database/models/User";
import  { deleteAllGroups } from "./database/resolvers/GroupPomodoroResolver";
import  { updateDatabase } from "./utils/updateDatabase";
import  { createGuild, updateGuild } from "./database/resolvers/GuildResolver";
import  { deleteAllCanceled } from "./database/resolvers/UserCanceledResolver";
import  { deleteUsersOnBreak } from "./database/resolvers/UserOnBreakResolver";
import  { deleteUserWorking } from "./database/resolvers/UserWorking";
import  { deleteGroupsBreak } from "./database/resolvers/GroupBreakResolver";


// Librerias usuario
import config from './config';
import './database'
import { channel } from 'diagnostics_channel';


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
			type: "PLAYING",
			name: "Como Ser productivo",
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
					console.log("comandos registrados exitosamente de manera global");
					
				}else{
					await rest.put(Routes.applicationGuildCommands(CLIENT_ID,config.GUILD_ID), {
						body: commands
					});
					console.log("comandos registrados exitosamente de manera local");
				}
			} catch (error) {
				if(error)console.error(error);
			}
		})();

		// REINICIO DE LOS EVENTOS DEL BOT CUANDO SE INSTALA EN UN SERVER
		 if (!(client.user?.tag === "SpongeBob#9136")) {
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
		 }
	});
	
	client.on("interactionCreate", async (interaction) => {
		
		try {	
			if (interaction.isButton()) {
				const { customId } = interaction;
				if (customId === "pomodoro") {
					await client.commands.get(customId).execute(interaction, {
						work: 25,
						rest: 0,
						error: { pom: "", rest: "" },
					});
				} else if (customId === "grupo") {
					await client.commands.get(customId).execute(interaction, {
						work: 25,
						rest: 0,
						error: { pom: "", rest: "" },
					});
				} else {
					
					await client.commands.get(customId).execute(interaction);
				}
			}

			if (interaction.isCommand()) {
				const { commandName } = interaction;
				if (!client.commands.has(commandName)) return;

				try {
					await client.commands.get(commandName).execute(interaction);
				} catch (error) {
					console.error(error);
					return interaction.reply({
						content: "ha ocurrido un error mientras de intenta ejecutar el comando",
						ephemeral: true,
					});
				}
			}
		} catch(err) {
			if(err)console.log(err);

			await interaction.reply({
				content:"ha ocurrido un error mientras de intenta ejecutar el comando",
				emphemeral:true
			})
		}
    });

	client.on("messageCreate", async (message) => {
        try {
            if (message.author.bot) return;
            let options = await handleMessage(message);
            if (options === null) {
            	options = {};
            }
            options.message = message;
            let { command } = options;
            let interaction = null;

            if (command === "grupo") {
                let validGroupPomodoro = await canStartGroup(message);
                if (validGroupPomodoro) {
                    if (!options.work) {
                    	options.work = 25;
                    }
                    await client.commands.get("grupo").execute(interaction, options);
                }
                return;
            }

            if (command === "pom" || command === "pomodoro") {
                let validPomodoro = await canStartPomodoro(message);
                if (validPomodoro) {
                    if (!options.work) {
                    options.work = 25;
                    }
                    await client.commands.get("pomodoro").execute(interaction, options);
                }
                return;
            }

            if (!client.commands.has(command)) {
                if (command === "alltime" || command === "leaderboards") {
                    await client.commands
						.get("leaderboard")
						.execute(interaction, options);
                    return;
                } else if (command === "cancelar") {
                    options.isGroup
                    ? await client.commands
                        .get("cancelargrupo")
                        .execute(interaction, options)
                    : await client.commands
                        .get("cancelarpom")
                        .execute(interaction, options);
                    return;
                }
            }

            if (client.commands.get(command) === undefined) return;

            await client.commands.get(command).execute(interaction, options);
        } catch (error) {
            console.log(error);
        }
    });

    client.on("guildCreate", async (guildData) => {
        try {
            let guildExists = await GuildModel.exists({ guildId: guildData.id });
            if (!guildExists) {
            await createGuild(guildData);
            }
        } catch (error) {
            console.log(error);
        }
    });

	client.on("guildMemberRemove", async (guildMember) => {
        await updateGuild(guildMember.guild);
    });

    client.on("guildMemberAdd", async (guildMember) => {
        await updateGuild(guildMember.guild);
    });

	// LOGIN DEL BOT
	client.login(config.BOTOKEN);
}

main();