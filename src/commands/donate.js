import { MessageEmbed,MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

let data = new SlashCommandBuilder()
    .setName('donar')
    .setDescription('En caso de que quieras apoyar el mantenimiento del bot ♥')

let donateEmbed = new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Donar')
    .setFooter({text:'hecho con ♥ por bygrel y piedraprog v 1.0.2'})
    .setDescription('Si te gusta el bot y quieres apoyarlo, puedes hacerlo con una donación a la cuenta de paypal de este bot.\n\n' )

const donateRow = new MessageActionRow().addComponents(
    new MessageButton()
        .setLabel("Buy me a coffee")
        .setStyle("LINK")
        .setEmoji("☕")
        .setURL("https://ko-fi.com/pomobot"),
    new MessageButton()
        .setLabel("Github")
        .setStyle("LINK")
        .setEmoji("💻")
        .setURL("https://github.com/holasoygrel/pomobot")
);


let intExe = async (interaction, options) => {

    await interaction.reply({
        content: `${interaction.user.toString()} gracias por el interés en mantener y usar el bot !`,
        embeds: [donateEmbed],
        components: [donateRow],
        ephemeral: false,
    });
};


let mesExe = async (message, options) => {
    await message.react("🙏");
    await message.channel.send({
        content: `${message.author.toString()}  gracias por el interés en mantener el bot!`,
        embeds: [donateEmbed],
        components: [donateRow],
        ephemeral: false,
    });
}


let execute = async (interaction, options) => {
    if (interaction !== null) {
        
        intExe(interaction, options);
    } else {
        mesExe(options.message);
    }
};


module.exports = {
    data,
    execute
}