import { MessageActionRow, MessageButton } from "discord.js";
import { MessageEmbed } from "discord.js";

// POMODORO INICIADO
const groupSesionStartEmbed = (duration) => {
  return new MessageEmbed()
    .setTitle("Sesion de Pomodoro Grupal iniciado")
    .addFields([
      {
        name: `🧑‍🤝‍🧑 Sesion de 4 Pomodoros de \`${duration} minutos\``,
        value: ":blush: Feliz trabajo!",
      },
    ])
    .setColor("#570000")
    .setTimestamp();
};

// BOTÓN DE MENSAJE ABAJO DEL POMODORO
const groupSesionStartRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelsesiongrupal")
    .setLabel("Terminar Sesion de Pomodoro Grupal")
    .setStyle("SECONDARY")
    .setEmoji("🚫")
);


const groupSesionEndEmbed = (duration, breakTimeStamp,cicle) => {
  return new MessageEmbed()
    .setTitle(`Pomodoro grupal nro ${cicle+1} Terminado`)
    .addFields([
      {
        name: `✅  \`${duration} minutos\``,
        value: `😌 Eso fue un trabajo increíble! Disfruta de tu Descanso.`,
      },
    ])
    .setColor("#570000")
    .setTimestamp(breakTimeStamp);
};

const groupSesionEndRow = new MessageActionRow().addComponents(
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

// DESCANSO CORTO 
let startSesionGroupBreakEmbed = (duration, timestamp,cicle) => {
  return new MessageEmbed()
    .setColor("#cddafd")
    .setTitle(`Descanso corto número: \`${cicle+1}\` iniciado`)
		.addFields({
		name: `:timer: \`${duration} minutos\``,
		value: "Los descansos son tan importantes como lo es el trabajar, Descansa bien!",
		})
    .setTimestamp(timestamp);
};

let startSesionGroupBreakRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelsesiongrupal")
    .setLabel("Termina el descanso grupal")
    .setStyle("SECONDARY")
    .setEmoji("🚫"),
);

let endSesionGroupBreakEmbed = (duration, timestamp,cicle) => {
  return new MessageEmbed()
    .setColor("#cddafd")
    .setTitle(`Descanso corto terminado, Empieza el pomodoro nro: \`${cicle+1}\``)
    .addFields({
      name: `✅  \`${duration} minutos\``,
      value: `😌 Espero hayas disfrutado tu descanso! \n `,
    })
    .setTimestamp(timestamp);
};

const endSesionGroupBreakRow = groupSesionEndRow;

// DESCANSO LARGO 
let startSesionGroupLongBreakEmbed = (duration, timestamp) => {
  return new MessageEmbed()
    .setColor("#cddafd")
      .setTitle("Descanso Largo iniciado")
    .addFields({
      name: `:timer: \`${duration} minutos\``,
      value: "Los descansos largos después de una sesión son tan importantes como lo es el trabajar, Descansa bien!",
    })
    .setTimestamp(timestamp);
};

const startSesionGroupLongBreakRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelsesiongrupal")
    .setLabel("Terminar el descanso largo")
    .setStyle("SECONDARY")
    .setEmoji("🚫"),
);

let endSesionGroupLongBreakEmbed = (duration, timestamp) => {
  return new MessageEmbed()
    .setColor("#cddafd")
    .setTitle("Sesión de Pomodoro Grupal ha terminado")
    .addFields({
      name: `✅  \`${duration} minutos\``,
      value: `😌 Espero hayas disfrutado tu sesión!`,
    })
    .setTimestamp(timestamp);
};


const endSesionGroupLongBreakRow = new MessageActionRow().addComponents(
	new MessageButton()
		.setCustomId("sesiongrupal")
		.setLabel("Empezar una nueva sesión de pomodoro")
		.setStyle("SECONDARY")
		.setEmoji("🚫"),
);

module.exports = {
  // POMODORO 
  groupSesionStartEmbed,
  groupSesionStartRow,
  groupSesionEndEmbed,
  groupSesionEndRow,
  // DESCANSO CORTO 
  startSesionGroupBreakEmbed,
  startSesionGroupBreakRow,
  endSesionGroupBreakEmbed,
  endSesionGroupBreakRow,
  // DESCANSO LARGO
  startSesionGroupLongBreakEmbed,
  startSesionGroupLongBreakRow,
  endSesionGroupLongBreakEmbed,
  endSesionGroupLongBreakRow
};
