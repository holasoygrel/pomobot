import { MessageEmbed } from "discord.js"

export let startEmbed = (time: number,descanso: number) => {
    return new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Pomodoro')
    .setTimestamp(Date.now())
    .addFields(
        { name: `:tomato: El tiempo del pomodoro se ha establecido a ${time} minutos :tomato:` , value: `:tomato: El descanso del pomodoro se ha establecido a ${descanso}  :tomato:`},
        { name: ':clock1: a darle duro!! :clock1:', value:'Puedes cancelar el pomodoro con el comando [%cancelar]'}, 
    )
    
}

export let endEmbed = new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Pomodoro')
    .setTimestamp()
    .addFields(
        { name: `:tomato: Felicidades has terminado tu sesión de pomodoro !!!!:tomato:`, value: ':blush: Disfruta tu descanso! :blush:' }
    )