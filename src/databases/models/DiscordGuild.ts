import mongoose from 'mongoose'
import { Schema } from 'mongoose';

export const GuildSchema = new Schema({
    guildId: String,
    guildName: String,
    guildOwner: String,
    guildMemberCount: Number,
});

export const GuildModel = mongoose.model('Guild', GuildSchema);