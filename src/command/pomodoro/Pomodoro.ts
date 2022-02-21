import { Message } from "discord.js";
import { deleteUserCanceledBreak, deleteUserCanceledPomodoro, isCanceledBreak, isCanceledPomodoro } from "../../databases/resolvers/UserCanceledResolver";
import { createUserOnBreak, deleteUserOnBreak } from "../../databases/resolvers/UserOnBreakResolver";
import { createUser, updateUser, userExists } from "../../databases/resolvers/UserResolver";
import { createUserWorking, deleteUserWorking } from "../../databases/resolvers/UserStudyingResolver";
import { DiscordUserData } from "../../types";
import { endBreakEmbed, startBreakEmbed } from "./BreakEmbed";
import { endEmbed, startEmbed } from "./PomodoroEmbed";

export let Pomodoro = async ( message: Message, workTime?: number, breakTime?: number) => {
    let author = message.author.tag;
    let authorId = message.author.id;
    let guildId = message.guild!.id;
    
    let workTimer = (workTime && workTime <= 120 && workTime >= 10) ? workTime : 25;
    let breakTimer = (breakTime && breakTime <= 30 && breakTime >= 5) ? breakTime: 5;

    let errorMessage = errorCheck(workTime, breakTime);

    createUserWorking(guildId, authorId, author, workTimer);
    await message.reply({
        content:errorMessage, 
        embeds: [startEmbed(workTimer,breakTimer)]
    });
    
    
    setTimeout(async () => {
        let canceledPomodoro = await isCanceledPomodoro(authorId);
        if(!canceledPomodoro) {
            await message.channel.send({ 
                content: message.author.toString(), 
                embeds:[endEmbed]
            });

            //remove from study list
            await deleteUserWorking(authorId);
            updateDatabase(guildId, authorId, author, workTimer);
            
            //Empieza un descanso
            if(breakTime) {
                await message.channel.send({
                    content:message.author.toString(), 
                    embeds:[startBreakEmbed(breakTimer)]
                });
                await createUserOnBreak(authorId, author);
                setTimeout(async () => {
                    let breakCanceled = await isCanceledBreak(authorId);
                    if(!breakCanceled){
                        await message.channel.send({
                            content: message.author.toString(), 
                            embeds:[endBreakEmbed]
                        });
                        await deleteUserOnBreak(authorId);
                    } else {
                        console.log('Descanso fue cancelado');
                        await deleteUserCanceledBreak(authorId);
                    }
                    
                }, 60000 * breakTimer!);
            }
        } else {
            console.log('El Pomodoro fue Cancelado');
            await deleteUserCanceledPomodoro(authorId);
        }
    }, 60000 * workTimer); 
}

export let errorCheck = (workTime?: number, breakTime?: number) => {
    let breakErrorMessage = (breakTime && (breakTime > 30 || breakTime < 5)) 
        ? '\`\`\`Error: El tiempo de descanso no esta dentro de los limites, el descanso se ha establecido a 5min\`\`\`' 
        : '';
    let workErrorMessage = (workTime && (workTime > 120 || workTime < 10)) ? 
        '\`\`\`Error: El tiempo de pomodoro especificado no esta dentro de los limites, el tiempo de pomodoro de ha establecido en 25min \`\`\`' 
        : '';     
    return workErrorMessage + breakErrorMessage;
}


export let updateDatabase = async (guildId: string, discordId: string, discordTag: string, minutesStudied: number) => {
    let userData: DiscordUserData = {
        guildId: guildId,
        discordId: discordId,
        discordTag: discordTag,
    }
    
    let isUser = await userExists(userData);
    if(!isUser){
        createUser(userData, minutesStudied)
    } else {
        updateUser(userData, minutesStudied);
    }
}




