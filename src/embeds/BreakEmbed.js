import { MessageEmbed } from "discord.js"

export let startBreakEmbed = (time) => {
    return new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Pomodoro')
    .setTimestamp()
    .addFields(
        { name: `:timer: el descanso tendra una duracion de ${time} minutos :timer:`, value: 'Escribe %cancelar si quieres cancelar tu descanso'},
    )
}

export let endBreakEmbed = new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Pomodoro')
    .setTimestamp()
    .addFields(
        { name: `:timer: El descanso ha terminado! :timer:`, value: ':blush: Ojala hayas disfrutado tu descanso! :blush:' }
    )