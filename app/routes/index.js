'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollController.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.get('/polls/:id', pollHandler.getPollUI);
	
	app.get('/new', isLoggedIn, function (req, res) {
		res.sendFile(path + '/public/new.html');
	});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/polls')
		.get(pollHandler.getPolls)
		.post(isLoggedIn, pollHandler.postPoll);
		
	app.get('/polls/:id/delete', isLoggedIn, pollHandler.deletePoll);
		
	app.get('/api/polls/me', isLoggedIn, pollHandler.getMyPolls);
		
	app.route('/api/polls/:id')
		.get(pollHandler.getPoll);
	
	app.post('/api/polls/vote/:id/:option', pollHandler.postVote);
	
	app.post('/api/polls/vote/new', isLoggedIn, pollHandler.postNewVote);
	
	app.route('/api/:id')
		.get(function (req, res) {
			if (req.user) {
				res.json(req.user);
			} else {
				res.send('');
			}
		});

	app.route('/api/me')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
