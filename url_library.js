"use strict";

function checkProtocol(url) {
  let urlAux = url;
  let regexHTTP = /^http:\/\//;
  let regexHTTPS = /^https?:\/\//;
  let result = {}
  if(regexHTTP.test(urlAux)) {
    return 'http';
  } else if(regexHTTPS.test(urlAux)) {
    return 'https';
  }
  return 'none';
}

function validateUrl(url) {
  let urlAux = url;
  if(checkProtocol(urlAux) !== 'none') {
    return true;
  }
  return url.indexOf('www') === 0;
}

function parseUrl(url) {
  let urlAux = url;
  if(checkProtocol(urlAux) === 'http') {
    console.log("URL with HTTP Protocol");
    return urlAux.substr(7);
  } else if(checkProtocol(urlAux) === 'https') {
    console.log("URL with HTTPS Protocol");
    return urlAux.substr(8);    
  }
  return urlAux;
}

module.exports = {
  validateUrl: validateUrl,
  parseUrl: parseUrl
}