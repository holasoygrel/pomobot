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
        { name: '¿Como ejecutar un comando?', value: 'Para ejecutar un comando escribe [%] seguido de la palabra del comando, para conocer los diferentes comandos escribe [%ayuda]'},
        { name: '¿Como iniciar un pomodoro?', value: 'Escribe [%pom] o [%pomodoro] para iniciar un pomodoro de 25 minutos con un descanso de 5 minutos, si se especifica un numero luego del comando tomara como tiempo de pomodoro sin descanso'},
        { name: 'Limites de tiempo', value: 'El pomodoro tiene como limite no mayor a 120 minutos y no menor a 10 minutos, si se intenta colocar un valor fuera de los limites se establecerá por defecto un tiempo de 25 min'},
        { name: 'Grupos', value: 'Para poder iniciar un grupo de pomodoro se tiene que escribir el comando desde un canal que contenga la palabra grupal y estar en un chat de voz que contenga la misma palabra'},
        { name: 'Grupos pomodoro por defecto', value: 'Para iniciar un pomodoro con tiempo predeterminado de 25 min solo tienes que escribir [%grupo pom]'},
        { name: 'Grupos pomodoro largo', value: 'Si se escribe [%grupo pom pom] se inicia automáticamente un pomodoro de 50 minutos'},
        { name: 'Líder de grupo', value: 'La persona que ha creado el grupo es la persona que puede cancelarlo'},        
    )