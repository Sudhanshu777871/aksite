import mongoose from 'mongoose';
import config from './config/environment';

export const mongooseConnectionPromise = mongoose.connect(config.mongo.uri, config.mongo.options);
