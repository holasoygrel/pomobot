import { time, SlashCommandBuilder } from "@discordjs/builders";
import { getUserMinutes } from "../database/resolvers/GuildResolver";
import { formatDuration } from "../utils/minutesToHours";
import { userMention } from "@discordjs/builders";

let formatData = (users) => {

	
	let rank = "";
	let minutes = "";
	for (let i = 0; i < users.length; i++) {
		let n = (i + 1).toString();
		if (i == 0) {
			n = ":first_place:";
		} else if (i == 1) {
			n = ":second_place:";
		} else if (i == 2) {
			n = ":third_place:";
		}

		const user = userMention(users[i].discordId);

		rank += `${i > 2 ? n + "." : n} ${user} \n`;

		let time = formatDuration(users[i].minutesStudied);
		minutes += `${time} \n`;
	}

	return { rank, minutes };
};

let intExe = async (interaction) => {
	let author = interaction.user;
	await interaction.deferReply();

	let users = await getUserMinutes(interaction.guild.id);
	let { rank, minutes } = formatData(users);

	await interaction.editReply({
		target: author,
		content:"rangos",
		embeds: [
			{
				title: "Tabla de posiciones",
				fields: [
					{ name: "Rankings", value: rank, inline: true },
					{
						name: "Tiempo total de pomodoro",
						value: minutes,
						inline: true,
					},
				],
				color: "GOLD",
				timestamp: time(new Date(), "R"),
			},
		],
		ephemeral: false,
	});
};

let mesExe = async (message) => {
	let users = await getUserMinutes(message.guild.id);
	let { rank, minutes } = formatData(users);

	await message.reply({
		target: message.author,
		embeds: [
			{
				title: "Tabla de posiciones",
				fields: [
					{ name: "Ranking", value: rank, inline: true },
					{
						name: "Tiempo total de pomodoro",
						value: minutes,
						inline: true,
					},
				],
				color: "GOLD",
				timestamp: time(new Date(), "R"),
			},
		],
	});
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rangos")
		.setDescription("Top 10, de los que mas tiempo han trabajado"),
	async execute(interaction, options) {
		if (interaction !== null) {
			intExe(interaction);
		} else {
			mesExe(options.message);
		}
	},
};
