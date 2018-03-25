var express = require('express');
var router = express.Router();

var authController = require('../controllers/authController');


router.get('/', (req, res) => {
	res.redirect('/auth/login');
});

router.get('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/google', authController.login_google);

router.get('/fb', authController.login_fb);

//callback url for google redirection

router.get('/google/redirect', authController.google_authenticate, 
	authController.google_redirect);

module.exports = router;