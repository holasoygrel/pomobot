import { Schema } from 'mongoose';
import mongoose from 'mongoose';

export const GroupBreakSchema = new Schema({
    channelId: String,
    authorId: String,
    authorTag: String,
});

export const GroupBreakModel = mongoose.model('GroupBreakChannels', GroupBreakSchema);