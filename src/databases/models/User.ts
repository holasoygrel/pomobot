import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    discordId: String,
    discordTag: String,
    minutesStudied: Number,
});
