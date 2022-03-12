import { time, SlashCommandBuilder } from "@discordjs/builders";
import { formatDuration } from "../utils/minutesToHours";
import { getUserMinutesStudied, userExists } from "../database/resolvers/UserResolver";

let intExe = async (interaction) => {
    let { user } = interaction;
    await interaction.deferReply({ ephermeral: true });

    let userData = {
        guildId: interaction.guild.id,
        discordId: user.id,
        discordTag: user.tag,
    };

    let isUser = await userExists(userData);
    let minutes = "";

    if (!isUser) {
        minutes = "0 minutos trabajados";
    } else {
        let minutesStudied = await getUserMinutesStudied(userData);
        minutes = formatDuration(minutesStudied);
    }

    await interaction.editReply({
        target: user,
        embeds: [
        {
            title: "Tiempo total que has estado enfocado trabajando",
            fields: [
            {
                name: `🍅  \`${minutes}\``,
                value: "\n 👏 sigue asi que haces un trabajo increíble!",
            },
            ],
            color: "RANDOM",
            timestamp: time(new Date(), "R"),
        },
        ],
        ephermeral: false,
    });
};

let mesExe = async (message) => {
    let { author } = message;
    let userData = {
        guildId: message.guild.id,
        discordId: message.author.id,
        discordTag: message.author.tag,
    };

    let isUser = await userExists(userData);
    let minutes = "";
    if (!isUser) {
        minutes = "0 minutos trabajados";
    } else {
        let minutesStudied = await getUserMinutesStudied(userData);
        minutes = formatDuration(minutesStudied);
    }

    await message.reply({
        target: author,
        embeds: [
        {
            title: "Tiempo total que has estado enfocado trabajando",
            fields: [
            {
                name: `🍅  \`${minutes}\``,
                value: "\n 👏 sigue asi haces un trabajo increíble!",
            },
            ],
            color: "RANDOM",
            timestamp: time(new Date(), "R"),
        },
        ],
    });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("productividad")
    .setDescription("Estadísticas personales de tiempo trabajado"),
  async execute(interaction, options) {
    if (interaction !== null) {
      intExe(interaction);
    } else {
      mesExe(options.message);
    }
  },
};
