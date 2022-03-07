import  { SlashCommandBuilder } from "@discordjs/builders";
import ms from "ms";

let intExe = async (interaction) => {

    const Msg = await interaction.channel.messages.fetch({ limit: 10 });

    const filtered = []
    
    await Msg.filter((m) => {

        filtered.push(m);
    })

    await interaction.channel.bulkDelete(filtered,true)

    interaction.channel.send({
            content: "mensajes eliminados",
    })
}

let mesExe = async (options) => {

    let { message } = options;
    const messages = await interaction.channel.message.fetch({ limit: 100 });

    const filtered = message.filter((msg) =>{
        
        Date.now() - msg.createdTimestamp < ms("14 days")
            
    });

    await interaction.channel.bulkDelete(filtered);

    interaction.channel.send({
        content: "mensajes eliminados",
    })
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("limpieza de mensajes"),

    execute: async (interaction, options) => {

        if (interaction !== null) {

            intExe(interaction);

        } else {

            mesExe(options);

        }
    },
}