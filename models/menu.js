var mongoose = require('mongoose');

// MONGOOSE/MODEL CONFIG
var MenuSchema = new mongoose.Schema({
    item: String,
    description: String,
    price: String,
    
    _category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories"
        }
        
    
});

module.exports = mongoose.model('menu', MenuSchema);