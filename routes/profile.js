var router = require('express').Router();

var authCheck = (req, res, next) => {
	if(!req.user){
		res.redirect('/auth/login');
	}
	else{
		next();
	}
};

router.get('/', authCheck, (req, res) => {
	//res.send('You are logged in as ' + req.user.username);

	res.render('profile', {title: 'Welcome to your profile', user: req.user});
});

module.exports = router;