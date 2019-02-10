"use strict";

function checkProtocol(url) {
  let urlAux = url;
  let regexHTTP = /^http:\/\//;
  let regexHTTPS = /^https?:\/\//;
  let result = {}
  if(regexHTTP.test(urlAux)) {
    return "http";
  } else if(regexHTTPS.test(urlAux)) {
    return "https";
  }
  return "none";
}

function validateUrl(url) {
  let urlAux = url;
  if(checkProtocol(urlAux) !== "none") {
    return true;
  }
  return url.indexOf("www") === 0;
}

function parseUrl(url) {
  let urlAux = url;
  let urlObject;
  if(checkProtocol(urlAux) === "http") {
    console.log("URL with HTTP Protocol");
    urlObject = { protocol: "http://", url: urlAux.substr(7) };
    return urlObject;
  } else if(checkProtocol(urlAux) === "https") {
    console.log("URL with HTTPS Protocol");
    urlObject = { protocol: "https://", url: urlAux.substr(8) };
    return urlObject;    
  }
  urlObject = { protocol: "https://", url: urlAux };
  return urlObject;
}

function getShortUrlNumber(url) {
  let urlAux = url;
  console.log("urlAux = " + urlAux);
  let urlArray = urlAux.split('/');
  console.log(urlArray.length);
  if(urlArray.length === 4) {
    return urlArray[3];
  }
  return false;
}

module.exports = {
  validateUrl: validateUrl,
  parseUrl: parseUrl,
  getShortUrlNumber: getShortUrlNumber
}