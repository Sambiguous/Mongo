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

                    var data = new db.Article(article)

                    data.save(function(err, doc, rows){
                        console.log(err.code);
                        console.log(doc);
                        console.log(rows)
                    })

                        //console.log("an error has occured");
                });

                // var scrape = new Scrape({data: results});
                // scrape.save();
            };
        });
        res.end()
    })
})

module.exports = router;