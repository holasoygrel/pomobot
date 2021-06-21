import { Message } from "discord.js";
import { createUserCanceled } from "../../databases/resolvers/UserCanceledResolver";
import { deleteUserOnBreak, isOnBreak } from "../../databases/resolvers/UserOnBreakResolver";
import { deleteUserWorking, isWorking } from "../../databases/resolvers/UserStudyingResolver";

export let CancelPomodoro = async (message: Message) : Promise<void> => {
    let currentlyWorking = await isWorking(message.author.id);
    let currentlyOnBreak = await isOnBreak(message.author.id);

    if(currentlyOnBreak) {
        await deleteUserOnBreak(message.author.id);
        await createUserCanceled(message.author.id, message.author.tag, false);
        await message.reply(
            'Descanso terminado'
        );
        return;
    } else if(!currentlyWorking && !currentlyOnBreak) {
        await message.reply(
            'No estas actualmente trabajando ni en un descanso! empieza una sesion de pomodoro escribiendo <" %pomodoro ">'            
        );
        return;
    } else if(currentlyWorking){
        await deleteUserWorking(message.author.id);
        await createUserCanceled(message.author.id, message.author.tag, true);
        await message.reply(
            'Pomodoro Cancelado'
        );
    }
}