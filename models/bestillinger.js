var mongoose = require('mongoose');

// MONGOOSE/MODEL CONFIG
var bestillingSchema = new mongoose.Schema({
    item: String,
    status: String,
    table: String
});

module.exports = mongoose.model('bestillinger', bestillingSchema);