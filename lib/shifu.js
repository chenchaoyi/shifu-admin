var Bluecat = require('bluecat');
var internals = {};
var Util = require('util');
var expect = require('chai').expect;

internals.Service = function(server, options) {
  options = options || {};
  server = server || 'http://localhost:8080'

  var api = Bluecat.Api('shifu');
  var bluecatService = new Bluecat.ServiceSync(api, server, {
    followAllRedirects: true
  });
  bluecatService.setProxy(options.proxy);

  this.service = bluecatService;

  this.proxy = undefined;
  this.server = server;
};

// Verify response statusCode and return more informative information when failed
internals.Service.prototype.checkStatus = function(res, expectedStatus) {
  if (Object.prototype.toString.call(expectedStatus) === '[object Array]') {
    expect(expectedStatus).to.include(res.data.statusCode,
        'Expected status code ' + res.data.statusCode + ' to equal ' + expectedStatus.join('|') +
        '.\n' + res.request.method + ' ' + res.request.uri + ' returned:\n' +
        Util.inspect(res.data.body, { depth: 5 }));
  } else {
    expect(res.data.statusCode).to.equal(expectedStatus,
        'Expected status code ' + res.data.statusCode + ' to equal ' + expectedStatus +
        '.\n' + res.request.method + ' ' + res.request.uri + ' returned:\n' +
        Util.inspect(res.data.body, { depth: 5 }));
  }
};

// All Shifu admin APIs should be put sequentially as
// the callback parameter of this function, so they'll be executed in order
internals.Service.prototype.run = function (fiberFuncs){
  return this.service.run(fiberFuncs);
};


// POST http://localhost:8080/_admin/api/route/${route}
// usage: setMockVariant({
//   fixture: 'fixture id',
//   variant: 'variant id'
// })
internals.Service.prototype.setMockVariant = function (options) {
  options = options || {};
  if (options.fixture === undefined) {
    throw(new Error('options.fixture needs to be defined'));
  }
  if (options.variant === undefined) {
    throw(new Error('options.variant needs to be defined'));
  }

  var r = this.service._admin.api.route['${routeName}'].POST({
    params: {
      routeName: options.fixture
    },
    body: {
      variant: options.variant
    }
  });
  this.checkStatus(r, 200);
  return r;
};

exports = module.exports = internals.Service;

