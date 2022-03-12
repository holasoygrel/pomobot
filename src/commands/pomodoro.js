// LIBRERIAS 
import  { SlashCommandBuilder } from "@discordjs/builders";
import moment from "moment";

// LIBRERIAS USUARIO
import  { parseInteractionOptions,parseMessageOptions } from "../utils/parseOptions";
import  { deleteUserCanceledBreak,deleteUserCanceledPomodoro,isCanceledBreak, isCanceledPomodoro,} from '../database/resolvers/UserCanceledResolver';
import  { createUserOnBreak, deleteUserOnBreak } from "../database/resolvers/UserOnBreakResolver";
import  { createUserWorking, deleteUserWorking, isWorking } from "../database/resolvers/UserWorking";
import  { isOnBreak } from "../database/resolvers/UserOnBreakResolver";
import  { updateDatabase } from "../utils/updateDatabase";
import  { pomStartEmbed, pomStartRow , pomEndEmbed , pomEndRow, startBreakEmbed, startBreakRow,endBreakEmbed,endBreakRow} from "../embeds/PomEmbed";



let intExe = async (interaction, options) => {
    let { user, member, guildId } = interaction;
    if (options === undefined) {
        options = parseInteractionOptions(interaction.options._hoistedOptions);
    }
    let { work, rest } = options;
    
    let authorId = user.id;
    let author = user.username + user.discriminator;

    let currentlyWorking = await isWorking(authorId);
    if (currentlyWorking) {
        await interaction.editReply("```Error: Ya estas trabajando!```");
        return;
    }

    let currentlyOnBreak = await isOnBreak(authorId);
    if (currentlyOnBreak) {
        await interaction.editReply("```Error: Estas en un descanso!```");
        return;
    }

    let breakTimeStamp = moment().add(work, "m").toDate();
    let endbreakTimeStamp = moment(breakTimeStamp).add(rest, "m").toDate();

    // start pomodoro
    createUserWorking(guildId, authorId, author, work);
    await interaction.reply({
        target: user,
        content: `${user.toString()} ${options.error.pom}${options.error.rest}`,
        embeds: [pomStartEmbed(work)],
        components: [pomStartRow],
        ephemeral: false,
    });

    // goes above
    let channel = await interaction.member.guild.channels.fetch(
        interaction.channelId
    );

    let canceledPomodoro = await isCanceledPomodoro(authorId);
    if (canceledPomodoro) {
        console.log("Pomodoro ha terminado");
        await deleteUserCanceledPomodoro(authorId);
    }

    // pomodoro
    setTimeout(async () => {
        // end pom
        let canceledPomodoro = await isCanceledPomodoro(authorId);
        if (canceledPomodoro) {
        console.log("Pomodoro was canceled");
        await deleteUserCanceledPomodoro(authorId);
        } else {
        await channel.send({
            target: user,
            content: `${user.toString()}`,
            embeds: [pomEndEmbed(work, breakTimeStamp, user)],
            components: [pomEndRow],
        });
        await deleteUserWorking(authorId);
        updateDatabase(guildId, authorId, author, work);

        if (rest) {
            await channel.send({
            target: user,
            content: `${user.toString()}`,
            embeds: [startBreakEmbed(rest, breakTimeStamp)],
            components: [startBreakRow],
            });

            await createUserOnBreak(authorId, author);
            setTimeout(async () => {
            let breakCanceled = await isCanceledBreak(authorId);
            if (breakCanceled) {
                console.log("Break was canceled");
                await deleteUserCanceledBreak(authorId);
            } else {
                await channel.send({
                target: user,
                content: `${user.toString()}`,
                embeds: [endBreakEmbed(rest, endbreakTimeStamp, user)],
                components: [endBreakRow],
                });
                await deleteUserOnBreak(authorId);
            }
            }, rest * 60000);
        }
        }
    }, work * 60000);
};

let mesExe = async (options) => {
    let { message } = options;
    let user = message.author;
    let authorId = user.id;
    let { guildId, channel } = message;
    let author = user.username + user.discriminator;
    let { work, rest, error } = parseMessageOptions(options.work, options.rest);

    let breakTimeStamp = moment().add(work, "m").toDate();
    let endbreakTimeStamp = moment(breakTimeStamp).add(rest, "m").toDate();

    createUserWorking(guildId, authorId, author, work);
     await message.reply({
        target: user,
        content: `${user.toString()} ${error.pom}${error.rest}`,
        embeds: [pomStartEmbed(work)],
        components: [pomStartRow],
    });

    let canceledPomodoro = await isCanceledPomodoro(authorId);
    if (canceledPomodoro) {
        console.log("Pomodoro terminado");
        await deleteUserCanceledPomodoro(authorId);
    }

    setTimeout(async () => {
        // end pom
        let canceledPomodoro = await isCanceledPomodoro(authorId);
        if (canceledPomodoro) {
            console.log("Pomodoro terminado");
            await deleteUserCanceledPomodoro(authorId);
        } else {
            await channel.send({
                target: user,
                content: `${user.toString()}`,
                embeds: [pomEndEmbed(work, breakTimeStamp, user)],
                components: [pomEndRow],
            });
            await deleteUserWorking(authorId);
            updateDatabase(guildId, authorId, author, work);

            if (rest) {
                await channel.send({
                    target: user,
                    content: `${user.toString()}`,
                    embeds: [startBreakEmbed(rest, breakTimeStamp)],
                    components: [startBreakRow],
                });

                await createUserOnBreak(authorId, author);
                setTimeout(async () => {
                    let breakCanceled = await isCanceledBreak(authorId);
                    if (breakCanceled) {
                        console.log("Descanso terminado");
                        await deleteUserCanceledBreak(authorId);
                    } else {
                        await channel.send({
                            target: user,
                            content: `${user.toString()}`,
                            embeds: [endBreakEmbed(rest, endbreakTimeStamp, user)],
                            components: [endBreakRow],
                        });
                        await deleteUserOnBreak(authorId);
                    }
                }, rest * 60000);
            }
        }
    }, work * 60000);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pomodoro")
        .setDescription("Empieza un pomodoro")
        .addIntegerOption((option) =>
        option
            .setName("work")
            .setDescription("El tiempo en minutos que quieres trabajar")
            .setRequired(false)
        )
        .addIntegerOption((option) =>
        option
            .setName("break")
            .setDescription("El tiempo en minutos que quieres descansar")
            .setRequired(false)
        ),
    execute: async (interaction, options) => {
        if (interaction !== null) {
            intExe(interaction, options);
        } else {
            mesExe(options);
        }
    },
};







