var internals = {};

internals.Service = function(server, options) {
  options = options || {};
  server = server || 'http://localhost:8080/_admin/api'

  var api = Bluecat.Api('shifu');
  var bluecatService = new Bluecat.ServiceSync(api, server, {
    followAllRedirects: true
  });
  bluecatService.setProxy(options.proxy);

  this.service = bluecatService;

  this.proxy = undefined;
  this.server = server;

  //return this.buildServices(servJson);
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


// POST http://localhost:8080/_admin/api/route/${route}
internals.Service.prototype.init = function (variant){
  var r = this.service.route[${routeName}].POST({
    body: {
      variant: variant
    }
  });
  this.checkStatus(r, 200);
  expect(r.data.body.sessionId).to.be.a('string');
  this.sessionId = r.data.body.sessionId;
  return r;
};

// set proxy for all requests
internals.Service.prototype.setProxy = function(proxy) {
  this.proxy = proxy;
};

exports = module.exports = internals.Service;

