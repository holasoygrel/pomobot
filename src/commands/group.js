import { SlashCommandBuilder } from "@discordjs/builders";
import moment from "moment";

import { isGroupBreak } from "../database/resolvers/GroupBreakResolver";
import { groupExists } from "../database/resolvers/GroupPomodoroResolver";
import {
    deleteGroupCanceledBreak,
    deleteGroupCanceledPomodoro,
    isCanceledGroup,
    isCanceledGroupBreak,
} from "../database/resolvers/GroupCanceledResolver";
import {
    createGroupBreak,
    deleteGroupBreak,
} from "../database/resolvers/GroupBreakResolver";
import {
    parseInteractionOptions,
    parseMessageOptions,
} from "../utils/parseOptions";
import {
    createGroup,
    deleteGroup,
} from "../database/resolvers/GroupPomodoroResolver";
import {
    groupStartEmbed,
    groupStartRow,
    groupEndEmbed,
    groupEndRow,
    startGroupBreakEmbed,
    startGroupBreakRow,
    endGroupBreakEmbed,
    endGroupBreakRow,
} from "../embeds/GroupEmbed";
import { updateDatabase } from "../utils/updateDatabase";


let data = new SlashCommandBuilder()
    .setName("grupo")
    .setDescription("Trabaja con amigos :D")
    .addIntegerOption((option) =>
        option
            .setName("work")
            .setDescription("el tiempo en minutos que vas a trabajar")
            .setRequired(false)
    )
    .addIntegerOption((option) =>
        option
            .setName("break")
            .setDescription("el tiempo en minutos que vas a descansar")
            .setRequired(false)
    );

let intExe = async (interaction, options) => {
    if (options === undefined) {
        options = parseInteractionOptions(interaction.options._hoistedOptions);
    }
    let { work, rest, error } = options;
    let { user, member, guildId, channelId } = interaction;
    let { id, username, discriminator } = user;
    let authorId = id;
    let authorTag = username + discriminator;
    let { voice } = member;
    let { channel } = voice;
    let textChannel = await interaction.member.guild.channels.fetch(
        interaction.channelId
    );

   
    await interaction.deferReply();

    // checks if you can start a group pomodoro
    let groupPomInProgress = await groupExists(channelId);
    let groupBreakInProgress = await isGroupBreak(channelId);

    if (groupPomInProgress) {
        await interaction.editReply("```Error: Pomodoro grupal en progreso```");
        return;
    } else if (groupBreakInProgress) {
        await interaction.editReply("```Error: Descanso grupal en progreso```");
        return;
    }

    if (channel === undefined || channel === null) {
        await interaction.editReply(
            "```Error: no estas conectado a un canal de voz```"
        );
        return;
    } else if (interaction.channel.type === "GUILD_TEXT" && !interaction.channel.name.includes("pomobot")
    ) {
        await interaction.editReply(
            "```Error: solo puedes iniciar un pomodoro grupal en el canal de texto pomodoro grupal```"
        );
        return;
    }

    let breakTimeStamp = moment().add(work, "m").toDate();
    let endbreakTimeStamp = moment(breakTimeStamp).add(rest, "m").toDate();

    let firstMembers = [...channel.members.values()];
    let firstUsersToPing = "";
    firstMembers?.forEach((member) => {
        if (!member.user.bot) {
            firstUsersToPing = firstUsersToPing.concat(
                `${member.user.toString()} `
            );
        }
    });

    let canceledGroup = await isCanceledGroup(channelId);
    if (canceledGroup) await deleteGroupCanceledPomodoro(channelId);
    await createGroup(authorId, authorTag, guildId, channelId, work);

    await interaction.editReply({
        target: user,
        content: `${firstUsersToPing} ${error.pom}${error.rest}`,
        embeds: [groupStartEmbed(work)],
        components: [groupStartRow],
        ephemeral: false,
    });

    setTimeout(async () => {
        let canceledGroup = await isCanceledGroup(channelId);
        if (canceledGroup) {
            console.log("Group was canceled");
            await deleteGroupCanceledPomodoro(channelId);
        } else {
            await deleteGroup(channelId);

            let members = [...channel.members.values()];
            let usersToPing = "";

            members.forEach((member) => {
                if (!member.user.bot) {
                    usersToPing = usersToPing.concat(
                        `${member.user.toString()} `
                    );
                    let memberTag =
                        member.user.username + member.user.discriminator;
                    updateDatabase(guildId, member.user.id, memberTag, work);
                }
            });

            await textChannel.send({
                target: user,
                content: usersToPing,
                embeds: [groupEndEmbed(work, breakTimeStamp)],
                components: [groupEndRow],
            });


            if (rest) {
                await textChannel.send({
                    content: usersToPing,
                    embeds: [startGroupBreakEmbed(rest, breakTimeStamp)],
                    components: [startGroupBreakRow],
                });
                await createGroupBreak(channelId, authorId, authorTag);

                setTimeout(async () => {
                    let breakCanceled = await isCanceledGroupBreak(channelId);

                    let members = [...channel.members.values()];
                    let usersToPing = "";

                    members.forEach((member) => {
                        if (!member.user.bot) {
                            usersToPing = usersToPing.concat(
                                `${member.user.toString()} `
                            );
                        }
                    });

                    if (!breakCanceled) {
                        await textChannel.send({
                            content: usersToPing,
                            embeds: [
                                endGroupBreakEmbed(rest, endbreakTimeStamp),
                            ],
                            components: [endGroupBreakRow],
                        });
                        await deleteGroupBreak(channelId);
                    } else {
                        console.log("Break was canceled");
                        await deleteGroupCanceledBreak(channelId);
                    }
                }, rest * 60000);
            }
        }
    }, work * 60000);
};

let mesExe = async (options) => {
    let { message } = options;
    let { work, rest, error } = parseMessageOptions(options.work, options.rest);
    let user = message.author;
    let { member, guildId, channelId } = message;
    let { id, username, discriminator } = user;
    let authorId = id;
    let authorTag = username + discriminator;
    let { voice } = member;
    let { channel } = voice;

    let breakTimeStamp = moment().add(work, "m").toDate();
    let endbreakTimeStamp = moment(breakTimeStamp).add(rest, "m").toDate();

    let firstMembers = [...channel.members.values()];
    let firstUsersToPing = "";
    firstMembers?.forEach((member) => {
        if (!member.user.bot) {
            firstUsersToPing = firstUsersToPing.concat(
                `${member.user.toString()} `
            );
        }
    });

    let canceledGroup = await isCanceledGroup(channelId);
    if (canceledGroup) await deleteGroupCanceledPomodoro(channelId);
    await createGroup(authorId, authorTag, guildId, channelId, work);

    await message.reply({
        target: user,
        content: `${firstUsersToPing} ${error.pom}${error.rest}`,
        embeds: [groupStartEmbed(work)],
        components: [groupStartRow],
    });

    setTimeout(async () => {
        let canceledGroup = await isCanceledGroup(channelId);
        if (canceledGroup) {
            console.log("Grupo cancelado");
            await deleteGroupCanceledPomodoro(channelId);
        } else {
            await deleteGroup(channelId);

            let members = [...channel.members.values()];
            let usersToPing = "";

            members.forEach((member) => {
                if (!member.user.bot) {
                    usersToPing = usersToPing.concat(
                        `${member.user.toString()} `
                    );
                    let memberTag =
                        member.user.username + member.user.discriminator;
                    updateDatabase(guildId, member.user.id, memberTag, work);
                }
            });

            await message.channel.send({
                target: user,
                content: usersToPing,
                embeds: [groupEndEmbed(work, breakTimeStamp)],
                components: [groupEndRow],
            });

            if (rest) {
                await message.channel.send({
                    content: usersToPing,
                    embeds: [startGroupBreakEmbed(rest, breakTimeStamp)],
                    components: [startGroupBreakRow],
                });
                await createGroupBreak(channelId, authorId, authorTag);

                setTimeout(async () => {
                    let breakCanceled = await isCanceledGroupBreak(channelId);

                    let members = [...channel.members.values()];
                    let usersToPing = "";

                    members.forEach((member) => {
                        if (!member.user.bot) {
                            usersToPing = usersToPing.concat(
                                `${member.user.toString()} `
                            );
                        }
                    });

                    if (!breakCanceled) {
                        await message.channel.send({
                            content: usersToPing,
                            embeds: [
                                endGroupBreakEmbed(rest, endbreakTimeStamp),
                            ],
                            components: [endGroupBreakRow],
                        });
                        await deleteGroupBreak(channelId);
                    } else {
                        console.log("descanso terminado");
                        await deleteGroupCanceledBreak(channelId);
                    }
                }, rest * 60000);
            }
        }
    }, work * 60000);
};

let execute = (interaction, options) => {
    if (interaction !== null) {
        intExe(interaction, options);
    } else {
        mesExe(options);
    }
};

module.exports = {
    data,
    execute,
};
