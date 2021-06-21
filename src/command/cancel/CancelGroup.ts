import { Message } from "discord.js";
import { deleteGroupBreak, isGroupBreak } from "../../databases/resolvers/GroupBreakResolver";
import { createGroupCanceled } from "../../databases/resolvers/GroupCanceledResolver";
import { deleteGroup, groupExists, isAuthor } from "../../databases/resolvers/GroupPomodoroResolver";

export let CancelGroup = async (message: Message) => {
    let isAuthorOfGroup = await isAuthor(message.author.id);
    let currentlyWorking = await groupExists(message.channel.id);
    let currentlyOnBreak = await isGroupBreak(message.channel.id);

    if(currentlyWorking) {
        if(isAuthorOfGroup) {
            await deleteGroup(message.channel.id);
            await createGroupCanceled(message.guild!.id, message.channel.id, true);
            await message.reply('Grupo terminado');
        } else {
            await message.reply('Solo el autor del grupo puede cancelar el pomodoro grupal');
        }
    } else if(currentlyOnBreak) {
        await deleteGroupBreak(message.channel.id);
        await createGroupCanceled(message.guild!.id, message.channel.id, false);
        await message.reply('Descanso terminado');
    } else if(!currentlyOnBreak && !currentlyWorking) {
        await message.reply('Pomodoro grupal no existe en este canal');
    }
}