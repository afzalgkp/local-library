var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
	first_name: {type: String, required: true, max: 100},
	family_name: {type: String, required: true, max: 100},
	date_of_birth: {type: Date},
	date_of_death: {type: Date}
});

AuthorSchema
.virtual('name')
.get(function(){
	return this.family_name + ', ' + this.first_name;
});

AuthorSchema
.virtual('url')
.get(function(){
	return '/catalog/author/' + this._id;
});

AuthorSchema
.virtual('lifeline')
.get(function(){
	if (this.date_of_birth || this.date_of_death)
		return (this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : 'Died ') + ' - ' + 
			(this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : 'Present');

	else
		return '--';		
});

module.exports = mongoose.model('Author', AuthorSchema);