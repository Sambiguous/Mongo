//Dependencies
var express  = require('express');
var mongoose = require('mongoose');
var request  = require("request");
var cheerio  = require("cheerio");

var Schema = mongoose.Schema;

var standardSchema = {
    title: String,
    descr: String,
    link: String,
    notes: [{date: Date, body: String}]
};

var articleSchema = new Schema(standardSchema);
var savedSchema = new Schema(standardSchema);

var Article = mongoose.model('articles', articleSchema);
var Saved = mongoose.model('saved', savedSchema);

var router = express.Router();

router.get("/", function(req, res){
    Article.find().then(function(doc){
        console.log(doc);
        res.render('index.handlebars',{articles: doc})
    })
})

module.exports = router;