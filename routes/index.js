//Dependencies
var express  = require('express');
var mongoose = require('mongoose');
var request  = require("request");
var cheerio  = require("cheerio");

var db = require('../models/index')

var router = express.Router();

router.get("/", function(req, res){
    db.Article.find().then(function(doc){
        console.log(doc);
        res.render('index.handlebars',{articles: doc})
    });
});

router.post("/", function(req, res){
    request("https://arstechnica.com/gadgets", function(err, response, html){

        var $ = cheerio.load(html);
        var results = [];

        $('.listing-latest').each(function(index, element){

            if(index === 0){
                console.log('routes/index.js line 27', 'for loop executing');

                $(element).children('article').each(function(index, element){

                    var article = {
                        title: $(element).children('header').children('h2').children('a').html(),
                        exerpt: $(element).children('header').find('p.excerpt').html(),
                        link: $(element).children('a').attr('href'),
                        saved: false,
                        notes: []
                    };

                    results.push(new db.Article(article));

                });
            };
        });

        var response

        try{
            db.Article.insertMany(results, {ordered: false}, function(err, docs){
                if(err){
                    console.log(err.result.toJSON());
                }
                else{
                    console.log(docs);
                }
            })
        }
        catch(err){
            console.log(err);
        }
        
        res.end()
    })
})

module.exports = router;