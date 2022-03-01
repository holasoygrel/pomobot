import { Message, MessageEmbed,MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';


let data = new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Lista de comandos que tiene el bot')


let helpEmbed = new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Comandos')
    .setFooter({text:'hecho con ♥ por bygrel y Jpdev v 1.0.2'})
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

const helpRow = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId("pomodoro")
        .setLabel("Start 25 min Pomodoro")
        .setStyle("SECONDARY")
        .setEmoji("🍅"),
    new MessageButton()
        .setCustomId("productivity")
        .setLabel("Productivity")
        .setStyle("SECONDARY")
        .setEmoji("📈"),
    new MessageButton()
        .setCustomId("leaderboard")
        .setLabel("Leaderboards")
        .setStyle("SECONDARY")
        .setEmoji("🏆"),
    new MessageButton()
        .setLabel("Github")
        .setStyle("LINK")
        .setURL("https://github.com/andreidimaano/Calcifer"),
    new MessageButton()
        .setCustomId("cook")
        .setLabel("Click me if you dare")
        .setStyle("DANGER")
        .setEmoji("⚠️")
);

let intExe = async (interaction, options) => {
    await interaction.reply({
        content: `${interaction.user.toString()} Fine, like moving the castle isn\'t hard enough!`,
        embeds: [helpEmbed],
        components: [helpRow],
        ephemeral: false,
    });
};
  
let mesExe = async (message) => {
    await message.react("😡");
    await message.channel.send({
        content: `${message.author.toString()} Fine, like moving the castle isn\'t hard enough!`,
        embeds: [helpEmbed],
        components: [helpRow],
    });
};
  
let execute = async (interaction, options) => {
    if (interaction !== null) {
        
        intExe(interaction, options);
    } else {
        mesExe(options.message);
    }
};
  
module.exports = {
    // LA INFORMACIÓN DEL COMANDO
    data,
    // LA FUNCIÓN LÓGICA DEL COMANDO
    execute,
};