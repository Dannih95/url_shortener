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

app.get("/", function(req, res){
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
    console.log("URL after parsing: " + url.url);
    // Takes the hostname and finds the ip
    dns.resolve4(url.url, function(err, ips) {
      if(err) {
        return res.json({"error": "a problem occured, while resolving the hostname"});
      }
      
      dns.reverse(ips[0], function(err, domains) {
        if(err) {
          return res.json({"error": err.code});
        }
        
        domains.forEach(function(domain) {
          console.log("domain = " + domain);
          dns.resolve4(domain, function(err, ipsAux) {
            console.log("ip = " + ipsAux[0]);
            if(err) {
              return res.json({"error": "a problem occured, I'm sorry while reversing"});
            }
            ipsAux.forEach(function(ip) {
              if(ip === ips[0]) {
                // Search for max short_url
                let query = [{ $group: { _id: "", maxShortUrl: { $max: "$short_url" } } }];
                dbo.collection("url-mapping").aggregate(query, function(err, result) {
                  if(err) {
                    return res.json({"error": err.code});
                  }
                  let document;
                  if(result.length != 0) {
                    console.log("max = " + result[0].maxShortUrl);
                    // If has at least 1 document inserted before, the insert uses the max short_url + 1
                    document = {"original_url": url.url, "short_url": (result[0].maxShortUrl + 1), "protocol": url.protocol};
                  } else {
                    document = {"original_url": url.url, "short_url": 1, "protocol": url.protocol};
                  }
                  dbo.collection("url-mapping").insertOne(document, function(err, resultInsert) {
                    if(err) { 
                      return res.json({"error": "couldn't register the new url"});
                    }
                    console.log("Url " + url.url + " registered on db");
                  });
                  return res.json({ "original_url": req.body.url, "short_url": ((result.length != 0) ? (result[0].maxShortUrl + 1) : 1)});
                });
              }
            });
          });
        });
      });
    });
  }
  else {
    return res.json({"error":"invalid URL "});
  }
});

app.get(/\/api\/shorturl\/[0-9]+/, function(req, res) {
  //console.log(req.originalUrl);
  var domain;
  let urlNumber = url_library.getShortUrlNumber(req.originalUrl);
  if(urlNumber) {
    let query = { "short_url": parseInt(urlNumber) };
    dbo.collection("url-mapping").findOne(query, function(err, result) {
      if(err) {
        return res.json({"error": err.code});
      }
      console.log("result = " + result.original_url);
      domain = result.protocol + result.original_url;
      return res.redirect(domain);
    });
  }
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});