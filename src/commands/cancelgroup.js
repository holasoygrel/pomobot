import { MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { userMention } from "@discordjs/builders";
import {deleteGroupBreak, isGroupBreak,
} from "../database/resolvers/GroupBreakResolver";
import { createGroupCanceled } from "../database/resolvers/GroupCanceledResolver";
import { deleteGroup, groupExists, isAuthor} from "../database/resolvers/GroupPomodoroResolver";


export const data = new SlashCommandBuilder()
    .setName("cancelargrupo")
    .setDescription("Termina el Pomodoro Grupal");

const group = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId("grupo")
        .setLabel("Da inicio a un Pomodoro Grupal de 25 min")
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
                "Solo el autor puede cancelar el pomodoro grupal"
            );
        }
    } else if (currentlyOnBreak) {
        await deleteGroupBreak(channel.Id);
        await createGroupCanceled(guildId, channelId, true);
        await interaction.editReply("Descando Terminado");
    } else if (!currentlyOnBreak && !currentlyWorking) {
        await interaction.editReply({
            content: "Pomodoro grupal no existe en este canal",
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
            await message.reply("Solo el autor puede cancelar el Pomodoro Grupal");
        }
    } else if (currentlyOnBreak) {
        await deleteGroupBreak(message.channel.id);
        await createGroupCanceled(message.guild.id, message.channel.id, false);
        await message.reply("Descanso Cancelado");
    } else if (!currentlyOnBreak && !currentlyWorking) {
        await message.reply({
            content: "Pomodoro grupal no existe en este Canal",
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
