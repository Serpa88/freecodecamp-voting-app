'use strict';

var Polls = require('../models/polls.js');
var mongoose = require('mongoose');

function PollsHandler() {
    this.getPolls = function(req, res) {
        Polls.find({})
            .exec(function(err, docs) {
                res.send(docs);
            });
    }
    this.getPoll = function(req, res) {
        Polls.findById(req.params.id, function(err, doc) {
            res.send(doc);
        });
    }
    this.postPoll = function(req, res) {
        var options = req.body.options.split('\r\n').map(function(item) {
            return [item, 0];
        });
        new Polls({ owner: req.user._id.toString(), title: req.body.title, options })
            .save();
        res.redirect('/');
    }
    this.getPollUI = function(req, res) {
        Polls.find({ _id: req.params.id }).count(function(err, count) {
            if (count === 1) {
                res.sendFile(process.cwd() + '/public/poll.html');
            }
            else {
                res.sendFile(process.cwd() + '/public/badPoll.html');
            }
        });
    }
    this.postVote = function(req, res) {
        Polls.findById(req.params.id, function(err, doc) {
            if (!doc) return res.send('Can\'t find Poll with that id');
            var opt = doc.options.find(option => option[0] === req.params.option);
            if (opt) {
                opt[1] += 1;
                Polls.update({ _id: doc._id }, doc, function(err, updt) {
                    res.send(updt);
                });
            }
        });
    }
    this.postNewVote = function(req, res) {
        Polls.findById(req.body.id, function(err, doc) {
            if (!doc) return res.send('Can\'t find Poll with that id');
            doc.options.push([req.body.option, 1]);
            Polls.update({ _id: doc._id }, doc, function(err, updt) {
                res.redirect('/polls/' + doc._id);
            });
        });
    }
    this.getMyPolls = function(req, res) {
        Polls.find({ owner: req.user._id.toString() }, function(err, docs) {
            res.send(docs);
        });
    }
}

module.exports = PollsHandler;
