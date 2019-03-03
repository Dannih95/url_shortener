"use strict";

const url = require('url');

function verifyUrl(urlInput) {
  let urlJSON = { 
    originalUrl: "", 
    hostname: "",
    path: "",
    protocol: "",
    isValid: true
  }
  let urlInputAux = urlInput;
  
  try {
    let protocol = checkProtocol(urlInput);
    if(protocol === "none") {
      urlInputAux = "https://" + urlInputAux;
    }
    const newUrl = url.parse(urlInputAux);
    urlJSON.originalUrl = urlInputAux;
    urlJSON.hostname = newUrl.hostname;
    urlJSON.path = newUrl.path;
    urlJSON.protocol = newUrl.protocol;
    return urlJSON;
    //console.log("HERE HERE HERE HERE HERE HERE " + newUrl.path);
  } catch(e) {
    if(e instanceof TypeError) {
      urlJSON.isValid = false;
      //console.log("INVALID URL HERE BITCH");
      return urlJSON;
    }
  }
}

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
  verifyUrl: verifyUrl,
  validateUrl: validateUrl,
  parseUrl: parseUrl,
  getShortUrlNumber: getShortUrlNumber
}