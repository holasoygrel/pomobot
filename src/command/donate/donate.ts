import { Message, MessageEmbed } from "discord.js";

export const donate = async (message: Message) : Promise<void> => {
    await message.react('🙏');
    await message.channel.send(
        `${message.author}!`, 
        donateEmbed
    );
}

let donateEmbed = new MessageEmbed()
.setColor('#dc2f02')
.setTitle(':blush: Donaciones :blush:')
.addFields(
    { name: 'Buy me a coffee', value: 'https://ko-fi.com/pomobot'},
)