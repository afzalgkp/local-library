var Author = require('../models/author');
var Book = require('../models/book');
var async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

//Display list of all authors
exports.author_list = function(req, res){
	//res.send('NOT IMPLEMENTED: Author list');

	Author.find()
	.sort([['family_name', 'ascending']])
	.exec(function(err, author_list){
		if (err) return next(err);
		else
			res.render('author_list', {title: 'Author List', author_list: author_list, user: req.user});
	});
};

//Display details of s specific author
exports.author_detail = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);

	async.parallel({
        thisauthor: function(callback){
            Author.findById(req.params.id)
            .exec(callback);
        },
        books: function(callback){
            Book.find({'author': req.params.id})
            .exec(callback);
        }
    },
    function(err, results){
        if(err) return next(err);
        if(results.thisauthor == null){
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }

        res.render('author_detail', {title: 'Author Details', author: results.thisauthor, books: results.books, user: req.user});
    });
};

//Display Author create form on GET
exports.author_create_get = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Author create GET');
    res.render('author_form', {title: 'Create Author', user: req.user});
};

//Handle Author create on POST
exports.author_create_post = [
    body('first_name').isLength({min:1}).trim().withMessage('First name should be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({min:1}).trim().withMessage('Family name should be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    (req, res, next) =>{
        if(req.user){
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array(), user: req.user});
            }
            else{
                var author = new Author(
                        {
                            first_name: req.body.first_name,
                            family_name: req.body.family_name,
                            date_of_birth: req.body.date_of_birth,
                            date_of_death: req.body.date_of_death
                        }
                    );

                author.save(function(err){
                    if(err) return next(err);

                    res.redirect(author.url);
                });
            }
        }
        else{
            res.redirect('/auth/login');
        }
    }
];

//Display Author delete form on GET
exports.author_delete_get = function(req, res){
	res.send('NOT IMPLEMENTED: Author delete GET');
};

//Handle Author delete on POST
exports.author_delete_post = function(req, res){
	res.send('NOT IMPLEMENTED: Author delete POST');
};

//Display Author update form on POST
exports.author_update_get = function(req, res){
	res.send('NOT IMPLEMENTED: Author update GET');
};

//Handle Author update on POST
exports.author_update_post = function(req, res){
	res.send('NOT IMPLEMENTED: Author update POST');
};