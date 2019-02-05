'use strict';

var express = require('express');
var mongo = require('mongodb');
//var mongoose = require('mongoose');

var MongoClient = mongo.MongoClient;
// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

//Database
var dbo;

MongoClient.connect(MONGODB_URI, function(err, db) {
  if (err) throw err;
  dbo = db.db("url-shortener-pinho");
});

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  var example = { url: "www.facebook.com", newUrl: "www.freecodecamp.com" };
  dbo.collection("url-mapping").insertOne(example, function(err, res) {
    if(err) throw err;
    console.log("1 document inserted.");
    dbo.close();
  });
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});