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
    .setImage(
      "https://media.giphy.com/media/IzU4wcD554uGc/giphy.gif?cid=ecf05e474j8l5fkzkq7pyzb6d6tz02mk7shoihs8oae24j05&rid=giphy.gif&ct=g"
    )
    .addFields([
      {
        name: `✅  \`${duration} minutos\``,
        value: `😌 Eso fue un trabajo increíble! Disfruta de tu bien merecido Descanso.`,
      },
    ])
    .setColor("#570000")
    .setTimestamp(breakTimeStamp);
};

const groupEndRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("grupo")
    .setLabel("Incio un pomodoro de 25 minutos")
    .setStyle("SECONDARY")
    .setEmoji("🧑‍🤝‍🧑"),
  new MessageButton()
    .setCustomId("productivity")
    .setLabel("Productivity")
    .setStyle("SECONDARY")
    .setEmoji("📈"),
  new MessageButton()
    .setCustomId("leaderboard")
    .setLabel("Leaderboards")
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
  new MessageButton()
    .setLabel("Importancia de los descansos")
    .setStyle("LINK")
    .setURL("https://youtu.be/dzjsk5e7srI")
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
