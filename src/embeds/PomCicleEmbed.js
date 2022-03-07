const { MessageActionRow, MessageButton } = require("discord.js");
const { MessageEmbed } = require("discord.js");


// MENSAJE DE INCIO DE LA SESION DEL POMODORO
const pomCicleStartEmbed = (duration) => {
  return new MessageEmbed()
    .setTitle("Sesión Pomodoro iniciado")
    .addFields([
      {
        name: `🍅Sesión de 4 Pomodoros de \`${duration} minutos\``,
        value: "\n:blush: Feliz trabajo!\n",
      },
    ])
    .setColor("GREEN")
    .setTimestamp();
};

// BOTONES DEL MENSAJE POMODORO
const pomCicleStartRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelsesion")
    .setLabel("Terminar la sesión pomodoro")
    .setStyle("SECONDARY")
    .setEmoji("🚫")
);

// MENSAJE DE TERMINACIÓN DE LA SESIÓN DEL POMODORO
const pomCicleEndEmbed = (duration, breakTimeStamp, user, cicle) => {
  return new MessageEmbed()
    .setTitle(`Pomodoro nro: ${cicle} Finalizado`)
    .addFields([
      {
        name: `✅  \`${duration} minutes\``,
        value: `😌 disfruta tu *bien merecido* descanso! ${user.toString()} `,
      },
    ])
    .setColor("GREEN")
    .setTimestamp(breakTimeStamp);
};

const pomCicleEndRow = new MessageActionRow().addComponents(
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

let startCicleBreakEmbed = (duration, timestamp, cicle) => {
	return new MessageEmbed()
		.setColor("#cddafd")
		.setTitle(`Descanso corto número: \`${cicle+1}\` iniciado`)
		.addFields({
		name: `:timer: \`${duration} minutos\``,
		value: "Los descansos son tan importantes como lo es el trabajar, Descansa bien!",
		})
		.setTimestamp(timestamp);
};

const startCicleBreakRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelsesion")
    .setLabel("Terminar el descanso corto")
    .setStyle("SECONDARY")
    .setEmoji("🚫"),
);

let endCicleBreakEmbed = (duration, timestamp, user, cicle) => {
  return new MessageEmbed()
    .setColor("#cddafd")
    .setTitle(`Descanso corto terminado, Empieza el pomodoro nro: \`${cicle+1}\``)
    .addFields({
      name: `✅  \`${duration} minutos\``,
      value: `😌 Espero hayas disfrutado tu descanso! ${user.toString()} \n `,
    })
    .setTimestamp(timestamp);
};

const endCicleBreakRow = pomCicleEndRow;


// DESCANSO LARGO 
let startCicleLongBreakEmbed = (duration, timestamp) => {
  return new MessageEmbed()
    .setColor("#cddafd")
      .setTitle("Descanso Largo iniciado")
    .addFields({
      name: `:timer: \`${duration} minutos\``,
      value: "Los descansos largos después de una sesión son tan importantes como lo es el trabajar, Descansa bien!",
    })
    .setTimestamp(timestamp);
};

const startCicleLongBreakRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId("cancelsesion")
    .setLabel("Terminar el descanso largo")
    .setStyle("SECONDARY")
    .setEmoji("🚫"),
);

let endCicleLongBreakEmbed = (duration, timestamp, user) => {
  return new MessageEmbed()
    .setColor("#cddafd")
    .setTitle("Sesión de pomodoro ha terminado")
    .addFields({
      name: `✅  \`${duration} minutos\``,
      value: `😌 Espero hayas disfrutado tu sesión! ${user.toString()} `,
    })
    .setTimestamp(timestamp);
};


const endCicleLongBreakRow = new MessageActionRow().addComponents(
	new MessageButton()
		.setCustomId("sesionpomodoro")
		.setLabel("Empezar una nueva sesión de pomodoro")
		.setStyle("SECONDARY")
		.setEmoji("🚫"),
);


module.exports = {
  // POMODORO
  pomCicleStartEmbed,
  pomCicleStartRow,
  pomCicleEndEmbed,
  pomCicleEndRow,
  // DESCANSO CORTO
  startCicleBreakEmbed,
  startCicleBreakRow,
  endCicleBreakEmbed,
  endCicleBreakRow,
  // DESCANSO LARGO 
  startCicleLongBreakEmbed,
  startCicleLongBreakRow,
  endCicleLongBreakEmbed,
  endCicleLongBreakRow
};
