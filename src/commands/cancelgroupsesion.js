import { MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import {deleteGroupBreak, isGroupBreak,
} from "../database/resolvers/GroupBreakResolver";
import { createGroupCanceled } from "../database/resolvers/GroupCanceledResolver";
import { deleteGroup, groupExists, isAuthor} from "../database/resolvers/GroupPomodoroResolver";


export const data = new SlashCommandBuilder()
    .setName("cancelsesiongrupal")
    .setDescription("Termina la Sesion de Pomodoro Grupal");

const group = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId("sesiongrupal")
        .setLabel("Da inicio a una Sesion de Pomodoro Grupal ")
        .setStyle("SECONDARY")
        .setEmoji("🧑‍🤝‍🧑")
);

let intExe = async (interaction) => {
    let { user, channelId, guildId } = interaction;
    let authorId = user.id;

    await interaction.deferReply();

    let isAuthorOfGroup = await isAuthor(authorId);
    let currentlyWorking = await groupExists(channelId);
    let currentlyOnBreak = await isGroupBreak(channelId);

    if (currentlyWorking) {
        if (isAuthorOfGroup) {
            await deleteGroup(channelId);
            await createGroupCanceled(guildId, channelId, true);
            await interaction.editReply("Grupo Cancelado");
        } else {
            await interaction.editReply(
                "Solo el autor puede cancelar la sesion de pomodoro grupal"
            );
        }
    } else if (currentlyOnBreak) {
        await deleteGroupBreak(channelId);
        await createGroupCanceled(guildId, channelId, true);
        await interaction.editReply("Descanso Terminado");
    } else if (!currentlyOnBreak && !currentlyWorking) {
        await interaction.editReply({
            content: "Sesion de Pomodoro grupal no existe en este canal",
            components: [group],
        });
    }
};

let messExe = async (message) => {
    let isAuthorOfGroup = await isAuthor(message.author.id);
    let currentlyWorking = await groupExists(message.channel.id);
    let currentlyOnBreak = await isGroupBreak(message.channel.id);

    if (currentlyWorking) {
        if (isAuthorOfGroup) {
            await deleteGroup(message.channel.id);
            await createGroupCanceled(
                message.guild.id,
                message.channel.id,
                true
            );
            await message.reply("Grupo Cancelado");
        } else {
            await message.reply("Solo el autor puede cancelar la Sesion de Pomodoro Grupal");
        }
    } else if (currentlyOnBreak) {
        await deleteGroupBreak(message.channel.id);
        await createGroupCanceled(message.guild.id, message.channel.id, false);
        await message.reply("Descanso Cancelado");
    } else if (!currentlyOnBreak && !currentlyWorking) {
        await message.reply({
            content:"Sesion de Pomodoro grupal no existe en este canal",
            components: [group],
        });
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
