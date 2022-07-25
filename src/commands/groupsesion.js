import { SlashCommandBuilder } from "@discordjs/builders";
import moment from "moment";

import { isGroupBreak } from "../database/resolvers/GroupBreakResolver";
import { groupExists } from "../database/resolvers/GroupPomodoroResolver";
import { deleteGroupCanceledBreak,deleteGroupCanceledPomodoro,isCanceledGroup,isCanceledGroupBreak,} from "../database/resolvers/GroupCanceledResolver";
import {createGroupBreak,deleteGroupBreak,} from "../database/resolvers/GroupBreakResolver";
import { createGroup, deleteGroup} from "../database/resolvers/GroupPomodoroResolver";
import { updateDatabase } from "../utils/updateDatabase";
import {
    // POMODORO 
    groupSesionStartEmbed,
    groupSesionStartRow,
    groupSesionEndEmbed,
    groupSesionEndRow,
    // DESCANSO CORTO 
    startSesionGroupBreakEmbed,
    startSesionGroupBreakRow,
    endSesionGroupBreakEmbed,
    endSesionGroupBreakRow,
    // DESCANSO LARGO
    startSesionGroupLongBreakEmbed,
    startSesionGroupLongBreakRow,
    endSesionGroupLongBreakEmbed,
    endSesionGroupLongBreakRow
} from '../embeds/GroupSesionembed';


let data = new SlashCommandBuilder()
    .setName("sesiongrupal")
    .setDescription("ten una sesion de pomodoro con amigos :D")

let intExe = async (interaction) => {
    
    let work = 25, 
        rest = 5,
        longRes = rest * 3;

    let cicleCount = 0;
    let minute = 1000;

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

    // VERIFICACIÓN SI SE PUEDE INICIAR UNA SESIÓN GRUPAL DE POMODORO 
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
            "```Error: solo puedes iniciar un pomodoro grupal en el canal de texto #pomobot```"
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
        content: `${firstUsersToPing}`,
        embeds: [groupSesionStartEmbed(work)],
        components: [groupSesionStartRow],
        ephemeral: false,
    });
    
    // SESION GRUPAL POMODORO 
    let groupCicle = setInterval(async () =>{

        // CHANNEL IDENTIFICATION FOR MESSAGE
        let channel = await interaction.member.guild.channels.fetch(
            interaction.channelId
        );
        
        
        let canceledGroup = await isCanceledGroup(channelId);
        if (canceledGroup) {

            console.log("grupo fue cancelado");
            await deleteGroupCanceledPomodoro(channelId);
            clearInterval(groupCicle);

        } else{

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
                embeds: [groupSesionEndEmbed(work, breakTimeStamp,cicleCount)],
                components: [groupSesionEndRow],
            });


        }    

        // VERIFICATION IF SESIÓN IS ON LAST STAGE 
        if(cicleCount === 3 && !canceledGroup){           
            await channel.send({
                target: user,
                content: `${user.toString()} descanso largo inicio`,
                embeds: [startSesionGroupLongBreakEmbed(work, breakTimeStamp, user)],
                components: [startSesionGroupLongBreakRow],
            });
            // DESCANSO LARGO
            setTimeout(async () =>{
                await channel.send({
                    target: user,
                    content: `${user.toString()}`,
                    embeds: [endSesionGroupLongBreakEmbed(work, breakTimeStamp)],
                    components: [endSesionGroupLongBreakRow],
                });
            },longRes * minute)
            clearInterval(groupCicle)
            
        }else if(rest && cicleCount < 3 && !canceledGroup){

            let members = [...channel.members.values()];
            let usersToPing = "";
            members.forEach((member) => {
                if (!member.user.bot) {
                    usersToPing = usersToPing.concat(
                        `${member.user.toString()} `
                    );
                }
            });
            await textChannel.send({
                content: usersToPing,
                embeds: [startSesionGroupBreakEmbed(rest, breakTimeStamp,cicleCount)],
                components: [startSesionGroupBreakRow],
            });
            await createGroupBreak(channelId, authorId, authorTag);
            // DESCANSO  CORTO
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

                if (breakCanceled) {
                    console.log("Break was canceled");
                    await deleteGroupCanceledBreak(channelId);

                } else {

                    await textChannel.send({
                        content: usersToPing,
                        embeds: [
                            endSesionGroupBreakEmbed(rest, endbreakTimeStamp,cicleCount),
                        ],
                        components: [endSesionGroupBreakRow],
                    });
                    await deleteGroupBreak(channelId);

                }
            }, rest * minute);
        }else {

            console.log("error")
            clearInterval(groupCicle);

        }
        
        cicleCount++;

    },work * minute)

};

let mesExe = async (options) => {
    let { message } = options;
    
    let work = 25, 
        rest = 5,
        longRes = rest * 3;

    let cicleCount = 0;
    let minute = 60000;


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
        content: `${firstUsersToPing}`,
        embeds: [groupSesionStartEmbed(work)],
        components: [groupSesionStartRow],
    });

    let groupCicle = setInterval(async () =>{

        
        
        let canceledGroup = await isCanceledGroup(channelId);
        if (canceledGroup) {

            console.log("grupo fue cancelado");
            await deleteGroupCanceledPomodoro(channelId);
            clearInterval(groupCicle);

        } else{

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
                embeds: [groupSesionEndEmbed(work, breakTimeStamp,cicleCount)],
                components: [groupSesionEndRow],
            });


        }    

        // VERIFICATION IF SESIÓN IS ON LAST STAGE 
        if(cicleCount == 3 && !canceledGroup){

            await message.channel.send({
                target: user,
                content: `${user.toString()} descanso largo inicio`,
                embeds: [startSesionGroupLongBreakEmbed(work, breakTimeStamp, user)],
                components: [startSesionGroupLongBreakRow],
            });
            
            // DESCANSO LARGO
            setTimeout(async () =>{

                await message.channel.send({
                    target: user,
                    content: `${user.toString()}`,
                    embeds: [endSesionGroupLongBreakEmbed(work, breakTimeStamp)],
                    components: [endSesionGroupLongBreakRow],
                });

            },longRes * minute)

            clearInterval(groupCicle)
            
        }else if(rest && cicleCount < 3 && !canceledGroup){

            let members = [...channel.members.values()];
            let usersToPing = "";
            
            members.forEach((member) => {
                if (!member.user.bot) {
                    usersToPing = usersToPing.concat(
                        `${member.user.toString()} `
                    );
                }
            });

            await message.channel.send({
                content: usersToPing,
                embeds: [startSesionGroupBreakEmbed(rest, breakTimeStamp,cicleCount)],
                components: [startSesionGroupBreakRow],
            });

            await createGroupBreak(channelId, authorId, authorTag);

            // DESCANSO  CORTO
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

                if (breakCanceled) {
                    console.log("Descanso fue cancelado");
                    await deleteGroupCanceledBreak(channelId);

                } else {

                    await message.channel.send({
                        content: usersToPing,
                        embeds: [
                            endSesionGroupBreakEmbed(rest, endbreakTimeStamp,cicleCount),
                        ],
                        components: [endSesionGroupBreakRow],
                    });
                    await deleteGroupBreak(channelId);

                }
            }, rest * minute);
        }else {

            console.log("error")
            clearInterval(groupCicle);

        }
        
        cicleCount++;

    },work * minute)
    
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
