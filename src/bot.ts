import { Client } from 'discord.js';
import { botToken,prefix, userWorking} from './config';
import { onMessage } from './invokers/MessageInv';
import './database';
import { GuildModel } from './databases/models/DiscordGuild';
import { createGuild, updateGuild } from './databases/resolvers/GuildResolver';
import { deleteAllGroups } from './databases/resolvers/GroupPomodoroResolver';
import { UserWorkingModel } from './databases/models/UserWorking';
import { updateDatabase } from './command/pomodoro/Pomodoro';
import { deleteAllCanceled } from './databases/resolvers/UserCanceledResolver';
import { deleteUsersOnBreak } from './databases/resolvers/UserOnBreakResolver';
import { deleteUserWorking } from './databases/resolvers/UserStudyingResolver';


const client = new Client();

const main = async () => {
    

    client.login(botToken);

    client.on('ready', async () => {
        await client.user?.setActivity({
            type: 'PLAYING',
            name: 'ser productivo',
        })
        
        // informacion basica del servidor donde esta el bot 
        if(!(client.user?.tag === "SpongeBob#9136")){
            await deleteAllGroups();        

            let membersWorking = await UserWorkingModel.find({});
            
            membersWorking.forEach((user) => {
                if((user as userWorking).guildId){
                    console.log(user);
                    updateDatabase(
                        (user as userWorking).guildId, 
                        (user as userWorking).discordId, 
                        (user as userWorking).discordTag, 
                        (user as userWorking).minutes
                    );
                    deleteUserWorking((user as userWorking).discordId);
                }
            })
            
            await deleteAllCanceled();
            await deleteUsersOnBreak();
        }
    })
    
    client.on('message', async (message) => {
        if(message.author.bot) return;
        

        if(message.content.startsWith(prefix)){
            try {
                if(message.author.bot) return;
                await onMessage(message);
            } catch (error) {
                console.log(error);
            }
        }
    })
    
    client.on('guildCreate', async (guildData) => {
        try {
            let guildExists = await GuildModel.exists({guildId: guildData.id});
            if(!guildExists) {
                await createGuild(guildData);
            }
        } catch (error) {
            console.log(error);
        }
    })

    client.on('guildMemberRemove', async (guildMember) => {
        await updateGuild(guildMember.guild);
    })

    client.on('guildMemberAdd', async (guildMember) => {
        await updateGuild(guildMember.guild);
    })
}

main();