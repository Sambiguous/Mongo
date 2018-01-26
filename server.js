//Dependencies
var express        = require('express');
var bodyParser     = require("body-parser");
var exphbs         = require("express-handlebars");
var mongoose       = require('mongoose');
var routes         = require("./routes/index.js");
var methodOverride = require("method-override");


var PORT = process.env.PORT || 3000;

//===========================================
//Initialize Express and set up middleware 
//===========================================
var app  = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(routes);

//set Handlebars as the rendering engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//===============================================
//Initialize mongoDB connection using mongoose
//===============================================

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/headlines";

//Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//connect to database
mongoose.connect(MONGODB_URI);

//define mongo connection behavior
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Successfully connected to database");

    //if successfully connected to mongo, start server
    app.listen(PORT, function(){
        console.log("app listening on port 3000");
    });
});






