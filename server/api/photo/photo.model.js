import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PhotoSchema = new Schema({
    name: String,
    info: String,
    height: Number,
    width: Number,
    hidden: Boolean,
    featured: Boolean,
    fileId: String,
    thumbnailId: String,
    sqThumbnailId: String,
    metadata: {},
});

export const Photo = mongoose.model('Photo', PhotoSchema);
