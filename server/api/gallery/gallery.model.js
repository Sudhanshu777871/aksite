import {model, Schema} from 'mongoose';

export const GallerySchema = new Schema({
    name: String,
    info: String,
    date: Date,
    hidden: Boolean,
    photos: [String],
    featuredId: String,
    metadata: {},
});

export const Gallery = model('Gallery', GallerySchema);
