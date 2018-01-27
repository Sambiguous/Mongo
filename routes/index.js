//Dependencies
var express  = require('express');
var mongoose = require('mongoose');
var request  = require("request");
var cheerio  = require("cheerio");

var db = require('../models/index')

var router = express.Router();

router.get("/", function(req, res){
    db.Article.find().sort({posted_at: 1}).limit(30).exec(function(err, docs){

        res.render('index.handlebars',{articleArray: docs})
    });
});

router.get("/scrape", function(req, res){
    request("https://arstechnica.com/gadgets", function(err, response, html){

        var $ = cheerio.load(html, {decodeEntities: false});
        var scrapedArticles = [];

        $('.listing-latest').each(function(index, element){

            $(element).children('article').each(function(index, element){
                
                var article = {
                    title: $(element).children('header').children('h2').children('a').html(),
                    exerpt: $(element).children('header').find('p.excerpt').html(),
                    posted_at: new Date($(element).find('time').attr('datetime')),
                    link: $(element).children('a').attr('href'),
                    saved: false,
                    notes: []
                };

                scrapedArticles.push(new db.Article(article));
            });
        });

        db.Article.insertMany(scrapedArticles, {ordered: false}, function(err, insertedDocs){

            var numArticlesAdded = err ? err.result.nInserted : insertedDocs.length;

            db.Article.find({}).sort().limit(30).exec(function(err, docs){

                var responseObject = {
                    newArticles: numArticlesAdded,
                    articleArray: docs
                };

                res.render('index.handlebars', responseObject)
            });
        });
    });
});

router.get("/saved/:page?", function(req, res){
    res.end();
});

router.get("/favicon.io", function(req, res){
    //because nobody likes errors on the homepage console
    res.end();
})

module.exports = router;