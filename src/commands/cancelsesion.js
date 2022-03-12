import { MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { userMention } from "@discordjs/builders";
import { createUserCanceled } from "../database/resolvers/UserCanceledResolver";
import { deleteUserOnBreak,isOnBreak } from "../database/resolvers/UserOnBreakResolver";
import { deleteUserWorking, isWorking} from "../database/resolvers/UserWorking";



let data = new SlashCommandBuilder()
    .setName("cancelsesion")
    .setDescription("Cancela la sesión de pomodoro");

const sesionpom = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId("sesionpomodoro")
        .setLabel("Da inicio a una sesión pomodoro de 25 minutos")
        .setStyle("SECONDARY")
        .setEmoji("🍅")
);

let intExe = async (interaction) => {
    let { user } = interaction;
    let userMen = userMention(user.id);
    let authorId = user.id;
    let authorTag = user.username + user.discriminator;

    await interaction.deferReply();

    let currentlyWorking = await isWorking(authorId);
    let currentlyOnBreak = await isOnBreak(authorId);

    if (currentlyOnBreak) {
        await deleteUserOnBreak(authorId);
        await createUserCanceled(authorId, authorTag, false);
        await interaction.editReply("Descanso de la sesión de pomodoro terminado");
        return;
    } else if (!currentlyWorking && !currentlyOnBreak) {
        await interaction.editReply({
            content: `${userMen} Actualmente no estas trabajando ni en un descanso.\nPuedes iniciar una sesión de pomodoro escribiendo \`%sesionpomodoro\`, \`/sesionpomodoro\` o usar el botón de abajo :D.`,
            components: [sesionpom],
        });
        return;
    } else if (currentlyWorking) {
        await deleteUserWorking(authorId);
        await createUserCanceled(authorId, authorTag, true);
        await interaction.editReply("Sesion de pomodoro terminado");
    }
};

let messExe = async (message) => {
    let currentlyWorking = await isWorking(message.author.id);
    let currentlyOnBreak = await isOnBreak(message.author.id);

    if (currentlyOnBreak) {
        await deleteUserOnBreak(message.author.id);
        await createUserCanceled(message.author.id, message.author.tag, false);
        await message.reply("Descanso de la sesion de pomodoro terminado");
        return;
    } else if (!currentlyWorking && !currentlyOnBreak) {
        await message.reply({
            content:
                "Actualmente no estas trabajando ni en un descansoYou are not currently working nor on break.\nPuedes iniciar una sesión de pomodoro escribiendo \`%sesionpomodoro\`, \`/sesionpomodoro\` o usar los botones de abajo :D.",
            components: [sesionpom],
        });
        return;
    } else if (currentlyWorking) {
        await deleteUserWorking(message.author.id);
        await createUserCanceled(message.author.id, message.author.tag, true);
        await message.reply("Sesión de pomodoro terminado");
    }
};

let execute = async (interaction, options) => {
    if (interaction !== null) {
        intExe(interaction);
    } else {
        messExe(options.message);
    }
};

module.exports = {
    data,
    execute,
};
