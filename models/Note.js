var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var noteSchema = new Schema({
    data: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String,
        validate: [function(){
            return input.length > 0
          }, "Can't enter an empty note"]
    }
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note