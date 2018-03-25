var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');
var keys = require('./keys');
const User = require('../models/usermodel');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy({
		// options for the google strategy

		callbackURL: '/auth/google/redirect',
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret
	},
	(accessToken, refreshToken, profile, done) => {
		//passport callback function

		//check if user already exists in our db

		User.findOne({googleID: profile.id}).then((currentUser) => {
			if(currentUser){
				//user already present
				console.log('User is: ' + currentUser.username);
				done(null, currentUser);
			}
			else{
				//if not then create a new user in the db

				new User({
					username: profile.displayName,
					googleID: profile.id,
					thumbnail: profile._json.image.url
				}).save().then((newUser) => {
					console.log('New user created: ' + newUser);
					done(null, newUser);
				});
			}
		});
	})
);