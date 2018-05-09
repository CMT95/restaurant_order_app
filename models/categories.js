var mongoose = require('mongoose');

// MONGOOSE/MODEL CONFIG
var categoriesSchema = new mongoose.Schema({
    title: String,
    image: String,
    shop: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});

module.exports = mongoose.model('categories', categoriesSchema);