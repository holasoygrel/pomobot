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
import  { 
    // POMODORO
    pomCicleStartEmbed, pomCicleStartRow, pomCicleEndEmbed, pomCicleEndRow, 
    // DESCANSO
    startCicleBreakEmbed, startCicleBreakRow, endCicleBreakEmbed, endCicleBreakRow, 
    // DESCANSO LARGO
    startCicleLongBreakEmbed, startCicleLongBreakRow, endCicleLongBreakEmbed,endCicleLongBreakRow
} from '../embeds/PomCicleEmbed';


let intExe = async (interaction, options) => {

    // VARIABLES INCIALES
    let { user, member, guildId } = interaction;
    
    let work = 2, 
        rest = 1 ,
        longRes = rest * 3;

    let cicleCount = 0;
    let minute = 5000;
    
    let authorId = user.id;
    let author = user.username + user.discriminator;

    // VERIFICATION IF USER IS WORKING
    let currentlyWorking = await isWorking(authorId);
    if (currentlyWorking) {
        await interaction.editReply("```Error: Ya estas trabajando!```");
        return;
    }

    // VERIFICATION IF USER IS ON BREAK
    let currentlyOnBreak = await isOnBreak(authorId);
    if (currentlyOnBreak) {
        await interaction.editReply("```Error: Estas en un descanso!```");
        return;
    }

    // TIME STAMPS
    let breakTimeStamp = moment().add(work, "m").toDate();
    let endbreakTimeStamp = moment(breakTimeStamp).add(rest, "m").toDate();

    // start pomodoro
    createUserWorking(guildId, authorId, author, work);
    await interaction.reply({
        target: user,
        content: `${user.toString()}`,
        embeds: [pomCicleStartEmbed(work)],
        components: [pomCicleStartRow],
    });

    // goes above
    let canceledPomodoro = await isCanceledPomodoro(authorId);
    if (canceledPomodoro) {
        console.log("Pomodoro ha terminado");
        await deleteUserCanceledPomodoro(authorId);
    }
    
    // CICLE POMODORO  / CICLE POMODORO / CICLE POMODORO / CICLE POMODORO / CICLE POMODORO / CICLE POMODORO 
    let sessionCicle = setInterval(async () =>{

        // CHANNEL IDENTIFICATION FOR MESSAGE
        let channel = await interaction.member.guild.channels.fetch(
            interaction.channelId
        );
        
        
        let canceledPomodoro = await isCanceledPomodoro(authorId);
        if (canceledPomodoro) {

            console.log("Pomodoro terminado");
            await deleteUserCanceledPomodoro(authorId);
            clearInterval(sessionCicle);

        } else{

            await channel.send({
                target: user,
                content: `${user.toString()} Pomodoro terminado!`,
                embeds: [pomCicleEndEmbed(work, breakTimeStamp, user, cicleCount)],
                components: [pomCicleEndRow],
            });

            await deleteUserWorking(authorId);
            updateDatabase(guildId, authorId, author, work);

        }    

        // VERIFICATION IF SESIÓN IS ON LAST STAGE 
        if(cicleCount == 3 && !canceledPomodoro){

            console.log("descanso largo inicio")
            
            await channel.send({
                target: user,
                content: `${user.toString()} descanso largo inicio`,
                embeds: [startCicleLongBreakEmbed(work, breakTimeStamp, user)],
                components: [startCicleLongBreakRow],
            });
            
            // DESCANSO LARGO
            setTimeout(async () =>{

                await channel.send({
                    target: user,
                    content: `${user.toString()}`,
                    embeds: [endCicleLongBreakEmbed(work, breakTimeStamp, user)],
                    components: [endCicleLongBreakRow],
                });

            },longRes * minute)

            clearInterval(sessionCicle)
            
        }else if(rest && cicleCount < 3 && !canceledPomodoro){

            await channel.send({
                target: user,
                content: `${user.toString()}`,
                embeds: [startCicleBreakEmbed(rest, breakTimeStamp, cicleCount)],
                components: [startCicleBreakRow],
            });

            await createUserOnBreak(authorId, author);

            // DESCANSO  CORTO
            setTimeout(async () => {

                let breakCanceled = await isCanceledBreak(authorId);
                if (breakCanceled) {

                    await deleteUserCanceledBreak(authorId);

                } else {

                    await channel.send({
                        target: user,
                        content: `${user.toString()}`,
                        embeds: [endCicleBreakEmbed(work, endbreakTimeStamp, user, cicleCount)],
                        components: [endCicleBreakRow],
                    });
                    await deleteUserOnBreak(authorId);

                }
            }, rest * minute);
        }else {

            console.log("error")
            clearInterval(sessionCicle);

        }
        
        cicleCount++;

    },work * minute)

    
};

let mesExe = async (options) => {
    let { message } = options;
    let user = message.author;
    let authorId = user.id;
    let { guildId, channel } = message;
    let author = user.username + user.discriminator;
    
    let work = 2, 
        rest = 1 ,
        longRes = rest * 3;

    let cicleCount = 0;
    let minute = 5000;

    let breakTimeStamp = moment().add(work, "m").toDate();
    let endbreakTimeStamp = moment(breakTimeStamp).add(rest, "m").toDate();

    createUserWorking(guildId, authorId, author, work);
     await message.reply({
        target: user,
        content: `${user.toString()}`,
        embeds: [pomCicleStartEmbed(work)],
        components: [pomCicleStartRow],
    });

    // goes above
    let canceledPomodoro = await isCanceledPomodoro(authorId);
    if (canceledPomodoro) {
        console.log("Pomodoro ha terminado");
        await deleteUserCanceledPomodoro(authorId);
    }
    
    // CICLE POMODORO  / CICLE POMODORO / CICLE POMODORO / CICLE POMODORO / CICLE POMODORO / CICLE POMODORO 
    let sessionCicle = setInterval(async () =>{

        let canceledPomodoro = await isCanceledPomodoro(authorId);
        if (canceledPomodoro) {

            console.log("Pomodoro terminado");
            await deleteUserCanceledPomodoro(authorId);
            clearInterval(sessionCicle);

        } else{

            await channel.send({
                target: user,
                content: `${user.toString()} Pomodoro terminado!`,
                embeds: [pomCicleEndEmbed(work, breakTimeStamp, user, cicleCount)],
                components: [pomCicleEndRow],
            });

            await deleteUserWorking(authorId);
            updateDatabase(guildId, authorId, author, work);

        }    

        // VERIFICATION IF SESIÓN IS ON LAST STAGE 
        if(cicleCount == 3 && !canceledPomodoro){

            console.log("descanso largo inicio")
            
            await channel.send({
                target: user,
                content: `${user.toString()} descanso largo inicio`,
                embeds: [startCicleLongBreakEmbed(work, breakTimeStamp, user)],
                components: [startCicleLongBreakRow],
            });
            
            // DESCANSO LARGO
            setTimeout(async () =>{

                await channel.send({
                    target: user,
                    content: `${user.toString()}`,
                    embeds: [endCicleLongBreakEmbed(work, breakTimeStamp, user)],
                    components: [endCicleLongBreakRow],
                });

            },longRes * minute)

            clearInterval(sessionCicle)
            
        }else if(rest && cicleCount < 3 && !canceledPomodoro){

            await channel.send({
                target: user,
                content: `${user.toString()}`,
                embeds: [startCicleBreakEmbed(rest, breakTimeStamp, cicleCount)],
                components: [startCicleBreakRow],
            });

            await createUserOnBreak(authorId, author);

            // DESCANSO  CORTO
            setTimeout(async () => {

                let breakCanceled = await isCanceledBreak(authorId);
                if (breakCanceled) {

                    await deleteUserCanceledBreak(authorId);

                } else {

                    await channel.send({
                        target: user,
                        content: `${user.toString()}`,
                        embeds: [endCicleBreakEmbed(work, endbreakTimeStamp, user, cicleCount)],
                        components: [endCicleBreakRow],
                    });
                    await deleteUserOnBreak(authorId);

                }
            }, rest * minute);
        }else {

            console.log("error")
            clearInterval(sessionCicle);

        }
        
        cicleCount++;

    },work * minute)
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sesionpomodoro")
        .setDescription("Empieza una sesion de pomodoro de 25 minutos"),
    execute: async (interaction, options) => {
        if (interaction !== null) {
            intExe(interaction, options);
        } else {
            mesExe(options);
        }
    },
};







