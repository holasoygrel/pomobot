import { Message } from "discord.js";

export let Default = async (message: Message) : Promise<void> => {
    await message.reply('Comando invalido, puedes conocer los comandos escribiendo [ %ayuda ] o [ %empleo?] para saber como usar el bot');
}


