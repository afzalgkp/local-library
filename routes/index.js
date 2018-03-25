var express = require('express');
var router = express.Router();


var authCheck = (req, res, next) => {
	if(!req.user){
		res.redirect('/auth/login');
	}
	else{
		next();
	}
};

/* GET home page. */
router.get('/', authCheck, function(req, res) {
  //res.render('index', { title: 'Local Library' });
  res.redirect('/catalog');
});

module.exports = router;
