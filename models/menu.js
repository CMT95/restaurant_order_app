var mongoose = require('mongoose');

// MONGOOSE/MODEL CONFIG
var menuSchema = new mongoose.Schema({
    item: String,
    description: String,
    price: String,
    category: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        title: String
    }

});

module.exports = mongoose.model('menu', menuSchema);