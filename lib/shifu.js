/*jshint loopfunc: true */

var Fs = require('fs');
var Hoek = require('hoek');
var Request = require('request');

var internals = {};

internals.Service = function(servJson, host, options) {
  options = options || {};
  if (!host) {
    throw new Error('Missing host when trying to create services...');
  }
  this.proxy = undefined;
  this.host = host;

  // respect options passed in when object is created
  options = Hoek.merge(options, {
    strictSSL: false,
    jar: this.jar
  });
  Request = Request.defaults(options);

  return this.buildServices(servJson);
};

// set proxy for all requests
internals.Service.prototype.setProxy = function(proxy) {
  this.proxy = proxy;
};

// reset cookie jar
internals.Service.prototype.resetCookie = function() {
  this.jar = Request.jar();
  Request = Request.defaults({jar: this.jar});
};

exports = module.exports = internals.Service;

// simple logging hanlding
internals.init = function () {

  if (process.env.BLUECAT_DEBUG_CONSOLE) {
    internals.writeStream = process.stdout;
    return;
  }

  if (!process.env.BLUECAT_DEBUG_FILE) {
    return;
  }

  internals.writeStream = Fs.createWriteStream(
    process.env.BLUECAT_DEBUG_FILE,
    { flags: 'a' }
  );
};

internals.init();

