var mongoose = require('mongoose');

// MONGOOSE/MODEL CONFIG
var categorySchema = new mongoose.Schema({
    title: String,
    image: String,
    shop: String,
});

module.exports = mongoose.model('categories', categorySchema);