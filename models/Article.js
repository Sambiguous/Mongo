var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new  Schema({
    title: {
        type: String,
    },
    exerpt: {
        type: String
    },
    posted_at: {
        type: Date,
        required: true
    },
    link: {
        type: String,
        index: {
            unique: true
        }
    },
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
          type: Schema.Types.ObjectId,
          ref: "Note"
        }]
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;