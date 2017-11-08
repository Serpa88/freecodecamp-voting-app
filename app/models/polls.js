'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Polls = new Schema({
	title: String,
	options: [String],
});

module.exports = mongoose.model('Polls', Polls);
