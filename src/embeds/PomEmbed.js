const { MessageActionRow, MessageButton } = require("discord.js");
const { MessageEmbed } = require("discord.js");

const pomStartEmbed = (duration) => {
  return new MessageEmbed()
    .setTitle("Pomodoro inciado")
    .addFields([
      {
        name: `๐  \`${duration} minutos\``,
        value: "\n:blush: Feliz trabajo!\n",
      },
    ])
    .setColor("GREEN")
    .setTimestamp();
};

const pomStartRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelpom")
    .setLabel("Terminar el pomodoro")
    .setStyle("SECONDARY")
    .setEmoji("๐ซ")
);

const pomEndEmbed = (duration, breakTimeStamp, user) => {
  return new MessageEmbed()
    .setTitle("Pomodoro Finalizado")
    .addFields([
      {
        name: `โ  \`${duration} minutes\``,
        value: `๐ disfruta tu *bien merecido* descanso! ${user.toString()} `,
      },
    ])
    .setColor("GREEN")
    .setTimestamp(breakTimeStamp);
};

const pomEndRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("pomodoro")
    .setLabel("Pomodoro de 25 minutos")
    .setStyle("SECONDARY")
    .setEmoji("๐"),
  new MessageButton()
    .setCustomId("productividad")
    .setLabel("Productividad")
    .setStyle("SECONDARY")
    .setEmoji("๐"),
  new MessageButton()
    .setCustomId("rangos")
    .setLabel("Tabla de clasificaciรณn")
    .setStyle("SECONDARY")
    .setEmoji("๐")
);

let startBreakEmbed = (duration, timestamp) => {
  return new MessageEmbed()
    .setColor("#cddafd")
      .setTitle("Descanso iniciado")
    .addFields({
      name: `:timer: \`${duration} minutos\``,
      value: "Los descansos son tan importantes como lo es el trabajar, Descansa bien!",
    })
    .setTimestamp(timestamp);
};

const startBreakRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelpom")
    .setLabel("Terminar el descanso")
    .setStyle("SECONDARY")
    .setEmoji("๐ซ"),
);

let endBreakEmbed = (duration, timestamp, user) => {
  return new MessageEmbed()
    .setColor("#cddafd")
    .setTitle("Denscanso termiando")
    .addFields({
      name: `โ  \`${duration} minutos\``,
      value: `๐ Espero hayas disfrutado tu descanso! ${user.toString()} `,
    })
    .setTimestamp(timestamp);
};

const endBreakRow = pomEndRow;

module.exports = {
  pomStartEmbed,
  pomStartRow,
  pomEndEmbed,
  pomEndRow,
  startBreakEmbed,
  startBreakRow,
  endBreakEmbed,
  endBreakRow,
};
