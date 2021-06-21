import { Schema } from 'mongoose';
import mongoose from 'mongoose';

export const UserWorkingSchema = new Schema({
    discordId: String,
    discordTag: String,
    minutes: Number,
    guildId: String
});

export const UserWorkingModel = mongoose.model('WorkingMembers', UserWorkingSchema);