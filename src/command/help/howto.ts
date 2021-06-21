import { Message, MessageEmbed } from "discord.js";

export let Howto = async (message: Message) : Promise<void> => {
    await message.react('📖');
    await message.channel.send(
        `${message.author}  ✌!`, 
        howEmbed
    );
}

let howEmbed = new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle(':blush: Como Usarme :blush:')
    .addFields(
        { name: '¿Como ejecutar un comando?', value: 'Para ejecutar un comando se empieza por [%] y seguido de la palabra para conocer los diferentes comandos puede escribir [%ayuda]'},
        { name: '¿como iniciar un pomodoro?', value: 'puedes escribir [%pom] para iniciar un pomodoro de 25 minutos con un descanso de 5 minutos, si se especifica un numero luego del comando tomara como tiempo de pomodoro sin descanso'},
        { name: 'limites de tiempo', value: 'el pomodoro tiene como limite no mayor a 120 minutos y no menor a 10 minutos, si se intenta colocar un valor fuera de los limites se establecerá un tiempo de 25 min'},
        { name: 'Grupos', value: 'para poder iniciar un grupo de pomodoro se tiene que escribir el comando desde un canal llamado grupo y estar en un chat de voz con el mismo nombre'},
        { name: 'Grupos pomodoro por defecto', value: 'para iniciar un pomodoro con tiempo predeterminado de 25 min solo tienes que escribir [%grupo pom]'},
        { name: 'Grupos pomodoro largo', value: 'si se escribe [%grupo pom pom] se inicia automáticamente un pomodoro de 50 minutos'},
        { name: 'lider de grupo', value: 'la persona que ha creado el grupo es la persona que puede cancelarlo'},
        
    )