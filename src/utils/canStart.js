const { isGroupBreak } = require("../database/resolvers/GroupBreakResolver");
const { groupExists } = require("../database/resolvers/GroupPomodoroResolver");
const { isOnBreak } = require("../database/resolvers/UserOnBreakResolver");
const { isWorking } = require("../database/resolvers/UserWorking");

let canStartPomodoro = async (message) => {
	let authorId = message.author.id;
	let currentlyWorking = await isWorking(authorId);
	if (currentlyWorking) {
		await message.reply("```Error: Ya estas en un Pomodoro!```");
		return false;
	}
	let currentlyOnBreak = await isOnBreak(authorId);

	if (currentlyOnBreak) {
		await message.reply("```Error: Estas en descanso!```");
		return false;
	}
	return true;
};

let canStartGroup = async (message) => {
	let connected = message.member.voice.channelId;
	let channelId = message.channel.id;
	let groupPomInProgress = await groupExists(channelId);
	let groupBreakInProgress = await isGroupBreak(channelId);

	if (groupPomInProgress) {

		await message.reply("```Error: Pomodoro grupal en progreso```");
		return false;

	} else if (groupBreakInProgress) {

		await message.reply("```Error: Descanso grupal en progreso```");
		return false;

	} else if (connected === null) {

		await message.reply("```Error: No estas conectado a un canal de voz```");
		return false;

	} else if (!message.member?.voice?.channel?.name.includes("grupo")) {

		await message.reply("```Error: No estas conectado a un canal de voz de Pomodoro grupal```");
		return false;

	} else if (message.channel.type === "GUILD_TEXT" && !message.channel.name.includes("grupo")) {

		await message.reply("Solo puedes iniciar un Pomodoro grupal en el canal de Pomodoro grupal");
		return false;
		
	}

	return true;
};

module.exports = {
  canStartGroup,
  canStartPomodoro,
};
