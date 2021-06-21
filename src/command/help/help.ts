import { Message, MessageEmbed } from "discord.js";

export let Help = async (message: Message) : Promise<void> => {
    await message.react('👀');
    await message.channel.send(
        `${message.author} aqui tienes lo comandos ✌!`, 
        helpEmbed
    );
}

let helpEmbed = new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Comandos')
    .setFooter('hecho con ♥ por bygrel y Jpdev')
    // .setTimestamp()
    .addFields(
        { name: '% howto', value: 'Explicación de como usar el bot'},
        { name: '% ayuda', value: 'Lista de comandos que tiene el bot'},
        { name: '% pomodoro [numero]', value: 'Inicia un Pomodoro con la duración indicada'},
        { name: '% pomodoro [numero] break [numero]', value: 'Inicia un Pomodoro con la duración indicada'},
        { name: '% grupo [numero] ', value: 'Inicia un Pomodoro grupal con una duración indicada'},
        { name: '% grupo [numero] break [numero]', value: 'Inicia un Pomodoro grupal con un descanso'},
        { name: '% cancelar', value: 'cancela tu pomodoro o descanso'},
        { name: '% cancelar grupo', value: 'cancela el pomodoro grupal (tiene que ser el autor del grupo)'},
        { name: '% rangos', value: 'Tabla de clasificación de usuarios trabajando'},
        { name: '% productividad', value: 'verifica tus estadísticas de lo que has trabajado!'},
        { name: '% limpiar [numero]', value: 'elimina por una cantidad de mensajes especifica, si no se establece un numero por defecto borrara un total de 100 mensajes, en un máximo de fecha de dos semanas'},
        { name: '% donar', value: 'en caso de que quieras apoyar el mantenimiento del bot ♥'}
    )