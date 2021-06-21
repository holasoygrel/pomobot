import mongoose from 'mongoose';
require('dotenv').config()

// token del bot
export const botToken = process.env.DISCORD_BOTTOKEN as string;
// prefijo que usara el bot para ejecutar los comandos
export const prefix = process.env.PREFIX as string;
// direccion de la base de datos
export const dbUrl = process.env.MONGO_DBURL  as string;

export interface userWorking extends mongoose.Document {
    discordId: string,
    discordTag: string,
    minutes: number,
    guildId: string
}


