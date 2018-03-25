const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {type: String},
	googleID: {type: String},
	thumbnail: {type: String}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;