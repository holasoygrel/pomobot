import { prefix } from "../config";
import { Message } from "discord.js"
import { parseArguments } from './messageparser'
import { Pomodoro } from "../command/pomodoro/Pomodoro";
import { allTime } from "../command/alltime/alltime";
import { GroupPomodoro } from "../command/group/GroupPomodoro";
import { CancelGroup } from "../command/cancel/CancelGroup";
import { Productivity } from "../command/productivity/productivity";
import { Help } from "../command/help/help";
import { Default } from "../command/default/Default";
import { groupExists } from "../databases/resolvers/GroupPomodoroResolver";
import { isGroupBreak } from "../databases/resolvers/GroupBreakResolver";
import { isWorking } from "../databases/resolvers/UserStudyingResolver";
import { isOnBreak } from "../databases/resolvers/UserOnBreakResolver";
import { CancelPomodoro } from "../command/cancel/CancelPomodoro";
import { clean } from "../command/clean/clean";
import { Howto } from "../command/help/howto";
import { donate } from "../command/donate/donate";

export interface Arguments {
    command: string | undefined;
    workTime?: number;
    breakTime?: number;
    isGroup?: boolean;
}



export const onMessage= async (message: Message) : Promise<void> => {

    if (!message.guild) return;
    if (message.author.bot) return;
    if(!canHandleMessage(message)) return;
    let args = parseArguments(message.content.toLowerCase());

    // console.log("argumentos", args)
    try {
        await executeCommand(message, args);
    } catch (error) {
        await message.channel.send(error.message);
    }
}

// FUNCION DE MENU PARA EJECUTAR DIFERENTES COMANDOS
const executeCommand = async (message, args: Arguments) => {
    // console.log("mensaje", message.content );
    // console.log("argumentos",args );
    //(1) no discord guild exists
    if(!message.guild) return;

    console.log(`author: ${message.author.tag}`);
    console.log('args: ', args);
    switch(args.command) {
        case ('pom'):
        case ('pomodoro'): {
            
            let validPomodoro = await canStartPomodoro(message);
            if(validPomodoro) {
                (!args.workTime)? await Pomodoro(message, 25) : await Pomodoro(message, args.workTime, args.breakTime);
            }
            break;
        }
        case 'rangos' : {
            
            await allTime(message);
            break;
        }
        case 'grupo' : {
            let validGroupPomodoro = await canStartGroup(message);
            if(validGroupPomodoro) {
                await GroupPomodoro(message, args.workTime, args.breakTime);
                
            }

            break;

        }
        case ('cancelar'): {
            
            (args.isGroup) ? await CancelGroup(message) : await CancelPomodoro(message);
            break;
        }
        case ('productividad'): {
            
            await Productivity(message);
            break;
        }
        case 'ayuda' : {
            
            await Help(message);
            break;
        }
        case 'limpiar' : {

            clean(message, args.workTime);
            break;
        }
        case 'howto' : {

                Howto(message);
            break;
        }
        case 'donar' : {

                donate(message);
            break;
        }
        default: {
            await Default(message);
        }
    }
}

let canStartGroup = async (message: Message) => {


    let connected = message.member?.voice?.channelID;

    //Verifica si el grupo de pomodoro esta creado en la base de datos
    let channelId = message.channel.id;
    let groupPomInProgress = await groupExists(channelId);
    let groupBreakInProgress = await isGroupBreak(channelId);

    // VERIFICA SI SE PUEDE EMPEZAR UN POMODORO GRUPAL
    if(groupPomInProgress) {
        await message.reply('Grupo Pomodoro en progreso');
        return false;
     } else if (groupBreakInProgress) {
        await message.reply('Descanso grupal en progreso');
        return false;
    }else if(connected === null) {
        await message.reply('No estas conectado a un canal de voz');
        return false;
    } else if (!message.member?.voice?.channel?.name.includes('grupal')) {
        await message.reply('No estás conectado a un canal de voz de pomodoro grupal');
        return false;
    } else if(message.channel.type === 'text' && !message.channel.name.includes('pomobot')) {
        await message.reply('Solo puedes iniciar un pomodoro grupal en el canal de texto que contenga la palabra [pomobot]');
        return false;
    }

    return true;
}

let canStartPomodoro = async (message: Message) => {

    let authorId = message.author.id;
    let currentlyWorking = await isWorking(authorId);
    
    if(currentlyWorking) {
        await message.reply('Estas en un Pomodoro!');
        return false;
    }

    let currentlyOnBreak = await isOnBreak(authorId);
    if(currentlyOnBreak) {
        await message.reply('Estas en un descanso!');
        return false;
    }

    return true;
}


// Función que me dice si puede manejar un mensaje
let canHandleMessage = (message: Message) : boolean => {
    return (!message.author.bot && message.content.toLowerCase().startsWith(prefix));
}