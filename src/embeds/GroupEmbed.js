const { MessageActionRow, MessageButton } = require("discord.js");
const { MessageEmbed } = require("discord.js");

const groupStartEmbed = (duration) => {
  return new MessageEmbed()
    .setTitle("Pomodoro Grupal inciado")
    .addFields([
      {
        name: `🧑‍🤝‍🧑 \`${duration} minutos\``,
        value: ":blush: Feliz trabajo!",
      },
    ])
    .setColor("#570000")
    .setTimestamp();
};

const groupStartRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelargrupo")
    .setLabel("Terminar Pomodoro Grupal")
    .setStyle("SECONDARY")
    .setEmoji("🚫")
);

const groupEndEmbed = (duration, breakTimeStamp) => {
  return new MessageEmbed()
    .setTitle("Pomodoro Terminado")
    .addFields([
      {
        name: `✅  \`${duration} minutos\``,
        value: `😌 Eso fue un trabajo increíble! Disfruta de tu Descanso.`,
      },
    ])
    .setColor("#570000")
    .setTimestamp(breakTimeStamp);
};

const groupEndRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("grupo")
    .setLabel("Inicia un pomodoro de 25 minutos")
    .setStyle("SECONDARY")
    .setEmoji("🧑‍🤝‍🧑"),
  new MessageButton()
    .setCustomId("productividad")
    .setLabel("Productividad")
    .setStyle("SECONDARY")
    .setEmoji("📈"),
  new MessageButton()
    .setCustomId("rangos")
    .setLabel("Tabla de clasificación")
    .setStyle("SECONDARY")
    .setEmoji("🏆")
);

let startGroupBreakEmbed = (duration, timestamp) => {
  return new MessageEmbed()
    .setColor("#cddafd")
    .setTitle("Descanso iniciado")
    .addFields({
      name: `:timer: \`${duration} minutos\``,
      value: "Descansar es igual de importante que trabajar, Descansa bien!",
    })
    .setTimestamp(timestamp);
};

let startGroupBreakRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelargrupo")
    .setLabel("Termina el descanso grupal")
    .setStyle("SECONDARY")
    .setEmoji("🚫"),
);

let endGroupBreakEmbed = (duration, timestamp) => {
  return new MessageEmbed()
    .setColor("#cddafd")
    .setTitle("Descanso terminado")
    .addFields({
      name: `✅  \`${duration} minutos\``,
      value: `😌 Espero hayas disfrutado tu descanso!`, 
    })
    .setTimestamp(timestamp);
};

const endGroupBreakRow = groupEndRow;

module.exports = {
  groupStartEmbed,
  groupStartRow,
  groupEndEmbed,
  groupEndRow,
  startGroupBreakEmbed,
  startGroupBreakRow,
  endGroupBreakEmbed,
  endGroupBreakRow,
};
