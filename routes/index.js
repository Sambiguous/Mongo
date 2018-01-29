//Dependencies
var express  = require('express');
var mongoose = require('mongoose');
var request  = require("request");
var cheerio  = require("cheerio");

var db = require('../models/index')

var router = express.Router();

var ARTICLES_PER_PAGE = 15

router.get("/", function(req, res){

    res.redirect("/articles");
});

router.post("/articles", function(req, res){

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

            //record the number of new articles added from the scrape
            var numArticlesAdded = err ? err.result.nInserted : insertedDocs.length;

            //query the database for the 15 most recent articles
            db.Article.find({}).sort().limit(ARTICLES_PER_PAGE).exec(function(err, docs){

                //build object to send back to client
                var responseObject = {
                    newArticles: numArticlesAdded,
                    articleArray: docs
                };

                res.send(responseObject)
            });
        });
    });
});

router.post('/save', function(req, res){
    //update the article who's link property equals req.body.link. set the 'saved' property equal to req.body.saved
    db.Article.update({link: req.body.link},{ $set: { saved: req.body.saved } }, function(err, stuff){

        if(err) throw err

        res.json(stuff);
        
    })
});

router.post('/comment', function(req, res){
    console.log(req.body);

    var note = new db.Note({body: req.body.comment})

    console.log(note);

    note.save(function(err, doc){
        if(err){
            res.send({status: "error", error: err});
        }
        else{
            db.Article.findOneAndUpdate({link: req.body.link}, {$push: {'notes': doc._id}}, {new: true}, function(err, doc){
                if(err){
                    res.send(err);
                }
                else{
                    res.send(doc);
                };
            });
        };
    });
});

router.get("/articles/:page?", function(req, res){

    //set page variable equal to the page parameter if it exists, otherwise set it to 1
    var page = req.params.page ? parseInt(req.params.page) : 1

    db.Article.find({}).sort({posted_at: -1}).limit(ARTICLES_PER_PAGE * page).exec(function(err, docs){
        if(err) throw err

        //grab only the 15 articles that should be on the page.
        var articleArray = docs.slice(ARTICLES_PER_PAGE * (page - 1));

        //NEED TO REFORMAT DATE HERE TO BE LESS UGLY :(

        //build object to send back to client
        var responseObject = {
            page: page,
            nextPage: page + 1,
            prevPage: page > 1 ? page - 1 : 1,
            articleArray: articleArray
        }
        
        res.render("articles.handlebars", responseObject)
    }); 
});

router.get('/saved', function(req, res){

    db.Article.find({saved: true}).exec(function(err, docs){
        var responseObject = {
            articleArray: docs
        }
        res.render('saved.handlebars', responseObject);
    })
})

router.post('/comments/pop', function(req, res){

    db.Article.findOne({link: req.body.link}).populate('notes').exec(function(error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or, send our results to the browser, which will now include the books stored in the library
      else {
        res.send(doc);
      }
    });
})

router.get("/favicon.ico", function(req, res){
    //because nobody likes 404's in the homepage console
    res.end();
})

module.exports = router;