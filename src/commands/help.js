import { Message, MessageEmbed,MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';


let data = new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Lista de comandos que tiene el bot')


let helpEmbed = new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Comandos')
    .setFooter({text:'hecho con ♥ por bygrel y piedraprog v 2.0.0'})
    // .setTimestamp()
    .addFields(
        { name: '% howto', value: 'Explicación de como usar el bot'},
        { name: '% ayuda', value: 'Lista de comandos que tiene el bot'},
        { name: '% pomodoro [numero]', value: 'Inicia un Pomodoro con la duración indicada'},
        { name: '% pomodoro [numero] break [numero]', value: 'Inicia un Pomodoro con la duración indicada'},
        { name: '% cancelar', value: 'cancela tu pomodoro o descanso'},
        { name: '% grupo [numero] ', value: 'Inicia un Pomodoro grupal con una duración indicada'},
        { name: '% grupo [numero] break [numero]', value: 'Inicia un Pomodoro grupal con un descanso'},
        { name: '% cancelargrupo', value: 'cancela el pomodoro grupal (tiene que ser el autor del grupo)'},
        { name: '% sesionpomodoro', value: 'Inicia un ciclo de pomodro que consta de 4 pomodoros de 25 minutos con un descanso corto entre ellos y al terminar tienes un descanso largo'},
        { name: '% cancelsesion', value: 'Cancela la Sesion de pomodoro o el descanso que te encuentres'},
        { name: '% sesiongrupal', value: 'Inicia un ciclo de pomodoro grupal que consta de 4 Pomodoros de 25 minutos con un descanso corto entre ellos y al terminar tienes un descanso largo'},
        { name: '% cancelsesiongrupal', value: 'Cancela la Sesion Grupal de pomodoro o el descanso que te encuentres'},
        { name: '% rangos', value: 'Tabla de clasificación de usuarios trabajando'},
        { name: '% productividad', value: 'verifica tus estadísticas de lo que has trabajado!'},
    )

const helpRow = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId("pomodoro")
        .setLabel("Da incio a un pomodoro de 25 min")
        .setStyle("SECONDARY")
        .setEmoji("🍅"),
    new MessageButton()
        .setCustomId("Productividad")
        .setLabel("Productivity")
        .setStyle("SECONDARY")
        .setEmoji("📈"),
    new MessageButton()
        .setCustomId("rangos")
        .setLabel("Tabla de clasificación")
        .setStyle("SECONDARY")
        .setEmoji("🏆"),
    new MessageButton()
        .setCustomId("sesionpomodoro")
        .setLabel("Dar inicio a la sesion de pomodoro")
        .setStyle("LINK")
        .setURL("https://github.com/holasoygrel/pomobot"),
    new MessageButton()
        .setLabel("Github")
        .setStyle("LINK")
        .setURL("https://github.com/holasoygrel/pomobot"),
    new MessageButton()
        .setCustomId("Apoyar")
        .setLabel("Apoya el mantenimiento del bot ♥")
        .setStyle("PRIMARY")
        .setEmoji("🙏")
);

let intExe = async (interaction, options) => {
    await interaction.reply({
        content: `${interaction.user.toString()} Bien, Como si mover elefantes con las manos no fuese \'suficiente !`,
        embeds: [helpEmbed],
        components: [helpRow],
        ephemeral: false,
    });
};
  
let mesExe = async (message) => {
    await message.react("🙄");
    await message.channel.send({
        content: `${message.author.toString()} Bien, Como si mover elefantes con las manos no fuese suficiente !`,
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