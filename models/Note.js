var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var noteSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String
    }
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note