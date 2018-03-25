var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        book_count: function(callback) {
            Book.count(callback);
        },
        book_instance_count: function(callback) {
            BookInstance.count(callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.count({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.count(callback);
        },
        genre_count: function(callback) {
            Genre.count(callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results, user: req.user });
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: Book list');

    Book.find({}, 'title author')
    .populate('author')
    .sort([['title', 'ascending']])
    .exec(function(err, list_books){
    	if(err) { return next(err); }
    	res.render('book_list', {title: 'Book List', book_list: list_books, user: req.user });
    });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);

    async.parallel({
        thisbook: function(callback){
            Book.findById(req.params.id)
            .populate('author')
            .populate('genre')
            .exec(callback);
        },
        instances: function(callback){
            BookInstance.find({'book': req.params.id})
            .exec(callback);
        }
    },
    function(err, results){
        if(err) return next(err);
        if(results.thisbook == null){
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }

        res.render('book_detail', {title: 'Book Details', book: results.thisbook, instances: results.instances, user: req.user});
    });
}

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: Book create GET');

    async.parallel({
        authors: function(callback){
            Author.find(callback);
        },
        genres: function(callback){
            Genre.find(callback);
        }
    },
    function(err, results){
        if(err) return next(err);
        res.render('book_form', {title: 'Create Book', genres: results.genres, authors: results.authors, user: req.user});
    });
};

// Handle book create on POST.
exports.book_create_post = [

    (req, res, next) => {
        if(!req.user){
            res.redirect('/auth/login');
        }

        else{
            if(!(req.body.genre instanceof Array)) {
                if(typeof req.body.genre === 'undefined')
                    req.body.genre = [];
                else
                    req.body.genre = new Array(req.body.genre);
            }
            next();
        }
    },

    body('title', 'Title must not be empty.').isLength({min: 1}).trim(),
    body('author', 'Author must not be empty.').isLength({min: 1}).trim(),
    body('summary', 'Summary must not be empty.').isLength({min: 1}).trim(),
    body('isbn', 'ISBN must not be empty.').isLength({min: 1}).trim(),

    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body. isbn,
            genre: req.body.genre
        });

        if(!errors.isEmpty()){
            async.parallel({
                authors: function(callback){
                    Author.find(callback);
                },
                genres: function(callback){
                    Genre.find(callback);
                }
            },
            function(err, results){
                if(err) return next(err);

                for(let i=0; i< results.genres.length; i++){
                    if(book.genre.indexOf(results.genres[i]._id) > -1)
                        results.genres[i].checked = 'true';
                }
                res.render('book_form', {title: 'Create Book', genres: results.genres, book: book, authors: results.authors, errors: errors.array(), user: req.user});
            });
            return;
        }
        else{
            book.save(function(err){
                if(err) return next(err);

                res.redirect(book.url);
            });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};