var mongoose = require('mongoose');

// MONGOOSE/MODEL CONFIG
var categoriesSchema = new mongoose.Schema({
    title: String,
    image: String,
});

module.exports = mongoose.model('categories', categoriesSchema);