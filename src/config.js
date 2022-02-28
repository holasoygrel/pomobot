
require('dotenv').config()


export default {    // token del bot
    BOTOKEN: process.env.DISCORD_BOTTOKEN,
    // prefijo que usara el bot para ejecutar los comandos
    PREFIX: process.env.PREFIX,
    // VARIABLE QUE DEFINE EL ENTORNO DONDE ESTA EL BOT SI ES LOCAL O PRODUCCION
    ENV: process.env.ENV,
    // direccion de la base de datos
    DB_URL: process.env.MONGO_DBURL,
    // ID DEL CLIENTE
    CLIENT_APP_ID: process.env.CLIENT_APP_ID,
    // ID DEL SERVIDOR
    GUILD_ID: process.env.GUILD_ID,
}


// export const botToken = process.env.DISCORD_BOTTOKEN;
// export const prefix = process.env.PREFIX;
// export const dbUrl = process.env.MONGO_DBURL ;
// export const clientId = process.env.CLIENT_ID;
// export const guildId = process.env.GUILD_ID;


// export interface userWorking extends mongoose.Document {
//     discordId: string,
//     discordTag: string,
//     minutes: number,
//     guildId: string
// }


