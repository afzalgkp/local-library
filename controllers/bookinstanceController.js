var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
var async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

//Display list of all bookinstances
exports.bookinstance_list = function(req, res, next){
	//res.send('NOT IMPLEMENTED: BookInstance list');

	BookInstance.find({}, 'book imprint status due_back')
	.populate('book')
	//.sort([['status', 'ascending']])
	.exec(function(err, list_instances){
		if(err) return next(err);

		else
			res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_instances, user: req.user});
	});
};

//Display details of a specific BookInstance
exports.bookinstance_detail = function(req, res, next){
	//res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);

	BookInstance.findById(req.params.id)
	.populate('book')
	.exec(function(err, bookinstance){
		if(err) return next(err);
		res.render('bookinstance_detail', {title: 'Book Instance Detail', bookinstance: bookinstance, user: req.user})
	});
};

//Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next){
	//res.send('NOT IMPLEMENTED: BookInstance create GET');

	Book.find({}, 'title')
	.exec(function(err, books) {
		if(err) return next(err);

		res.render('bookinstance_form', {title: 'Create Book Instance', books: books, user: req.user})
	});
};

//Handle BookInstance create on POST
exports.bookinstance_create_post = [
	body('book', 'Book must be specified.').isLength({min: 1}).trim(),
	body('imprint', 'Book imprint must be specified.').isLength({min: 1}).trim(),
	body('due_back', 'Invalid due back date.').optional({checkFalsy: true}).isISO8601(),

	sanitizeBody('*').trim().escape(),
	sanitizeBody('due_back').toDate(),

	(req, res, next) => {
		const errors = validationResult(req);

		var bookinstance = new BookInstance({
			book: req.body.book,
			imprint: req.body.imprint,
			due_back: req.body.due_back,
			status: req.body.status
		});

		if(!errors.isEmpty()){
			Book.find({}, 'title')
			.exec(function(err, books){
				res.render('bookinstance_form', {title: 'Create Book Instance', books: books, bookinstance: bookinstance, errors: errors.array(), user: req.user});
			});

			return;
		}
		else{
			bookinstance.save(function(err) {
				if(err) return next(err);
				res.redirect(bookinstance.url);
			});
		}
	}
];

//Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res){
	res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

//Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res){
	res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

//Display BookInstance update form on POST
exports.bookinstance_update_get = function(req, res){
	res.send('NOT IMPLEMENTED: BookInstance update GET');
};

//Handle BookInstance update on POST
exports.bookinstance_update_post = function(req, res){
	res.send('NOT IMPLEMENTED: BookInstance update POST');
};