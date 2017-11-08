'use strict';

var Polls = require('../models/polls.js');

function PollsHandler () {
    this.getPolls = function (req, res) {
        Polls.find({  })
        .exec(function (err, docs) {
           res.send(docs);
        });
    }
    this.getPoll = function (req, res) {
        Polls.findById(req.params.id, function (err, doc) {
           res.send(doc);
        });
    }
    this.postPoll = function (req, res) {
        new Polls({ title: req.body.title, options: req.body.options.split('\r\n') })
        .save();
        res.redirect('/');
    }
}

module.exports = PollsHandler;
