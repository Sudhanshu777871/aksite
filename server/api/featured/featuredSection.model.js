'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    FeaturedItem = require('./featuredItem.model.js');

var FeaturedSectionSchema = new Schema({
    name: String,
    info: String,
    active: Boolean,
    items: [{}],
    fileId: String
});

module.exports = mongoose.model('FeaturedSection', FeaturedSectionSchema);
