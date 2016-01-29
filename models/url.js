'use strict';

var mongoose = require('mongoose');

var schema = mongoose.Schema({
    longUrl: String,
    shortUrl: String
});

var Url = mongoose.model('Url', schema);

module.exports = Url;