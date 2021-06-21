import { Message, MessageActivity, MessageEmbed } from "discord.js"

export let startGroupEmbed = (time: number) => {
    return new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Pomodoro')
    .setTimestamp(Date.now())
    .addFields(
                { name: `:tomato: eres el lider del grupo! :tomato:`, value: ` :tomato: Temporizador del Pomodoro grupal es ${time} min :tomato:`},
                { name: `:blush: Denle duro Cracks! :blush:`, value: 'puedes cancelar el pomodoro grupal escribiendo [%cancelar grupo]'},
            )
        
    
}




export let endGroupEmbed = new MessageEmbed()
    .setColor('#dc2f02')
    .setTitle('Pomodoro Descanso')
    .setTimestamp()
    .addFields(
        { name: `:tomato: Felicidades ha terminado la sesión grupal de Pomodoro :tomato:`, value: ':blush: Disfruten su Descanso! :blush:' }
)