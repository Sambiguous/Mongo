var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new  Schema({
    title: {
        type: String,
    },
    exerpt: {
        type: String
    },
    link: {
        type: String,
        index: true,
        unique: true
    },
    saved: {
        type: Boolean
    },
    notes: [{
          type: Schema.Types.ObjectId,
          ref: "Note"
        }]
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;