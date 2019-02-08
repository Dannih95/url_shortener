'use strict';

var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var dns = require('dns');
var url_library = require('./url_library');
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

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  var example = { original_url: "www.facebook.com", short_url: 1 };
  dbo.collection("url-mapping").insertOne(example, function(err, res) {
    if(err) throw err;
    console.log("1 document inserted.");
    dbo.close();
  });
  res.json({greeting: 'hello API'});
});

app.use(bodyParser.urlencoded({extended: false}));
app.post("/api/shorturl/new", function (req, res) {
  if(url_library.validateUrl(req.body.url)) {
    let url = url_library.parseUrl(req.body.url); // Gets Url without http/https if the case
    console.log("URL after parsing: " + url);
    // Takes the hostname and finds the ip
    dns.resolve4(url, function(err, addresses) {
      if(err) {
        res.json({"error": "a problem occured, I'm sorry while resolving the hostname"});
      }
      console.log("IP Address: " + addresses[0]);
      // Takes the ip and finds the hostname
      dns.reverse(addresses[0], function(err, records) {
        if(err) {
          res.json({"error": "a problem occured, I'm sorry while reversing the ip"});
        }
        if(records[0] === url) {
          let document = {"original_url": url, "short_url": "1"};
          dbo.collection("url-mapping").insertOne(document, function(err, res) {
            if(err) { 
              res.json({"error": "couldn't register the new url"});
            }
            console.log("Url " + url + " registered on db");
          });
          res.json({"original_url": req.body.url, "short_url": records[0]});
        } else {
          res.json({"error":"invalid URL"});
        }
      });
    });
  }
  else {
    res.json({"error":"invalid URL format"});
  }
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});