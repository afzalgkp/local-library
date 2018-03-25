var passport = require('passport');

exports.login = function(req, res){
	res.render('login', {title: 'Login Page'});
}

exports.logout = function(req, res){
	//handle with Passport

	//res.render('login', {title: 'Login Page', loginText: 'Logging out...'});

	req.logout();
	res.redirect('/auth');
}

exports.login_google = passport.authenticate('google', {
	scope: ['profile']
});

exports.login_fb = function(req, res){
	//handle with Passport

	res.render('login', {title: 'Login Page', loginText: 'Logging in with Facebook...'})
}

exports.google_redirect = function(req, res){
	//res.render('login', {title: 'You have successfully logged in using Google+ ', username: req.user});
	res.redirect('/catalog');
}

exports.google_authenticate = passport.authenticate('google');