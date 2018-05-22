var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

var ProfileSchema = new mongoose.Schema({
    profileType: String,
    username: String,
    password: String,
});

ProfileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('profile', ProfileSchema);