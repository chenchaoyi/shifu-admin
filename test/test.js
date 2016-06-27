var Http = require('http');
var Config = require('config');
var ShifuAdmin = require('../index');
var expect = require('chai').expect;

var t;

// Create local HTTP mock server for the test
var s = Http.createServer(function(req, res) {
  var responseBody = '';
  var requestBody;
  if (req.method == 'POST') {
    req.on('data', function(chunk) {
      requestBody = chunk.toString();
    });
  }
  req.on('end', function() {
    res.statusCode = 200;
    res.setHeader('X-PATH', req.url);
    responseBody = {
      status: 'OK',
      url: req.url,
      sessionId: 'test-session-id',
      requestBody: JSON.parse(requestBody)
    }
    res.end(JSON.stringify(responseBody));
  });
});


describe('Shifu admin client unit tests', function() {

  before(function(done) {
    // create shifu admin object
    t = new ShifuAdmin('http://localhost:6767', {
      proxy: Config.proxy
    });

    // start mock server
    s.listen(6767, function() {
      done();
    });
  });

  after(function(done) {
    s.close(function() {
      done();
    });
  });

  it('setMockVariant', function(done) {
    t.run(function() {
      var r = t.setMockVariant({
        fixture: 'testRoute',
        variant: 'testVariantId'
      });

      // verify response
      expect(r.err).to.equal(null);
      expect(r.data.statusCode).to.equal(200);
      expect(r.data.body).to.have.ownProperty('sessionId');
      expect(r.data.body.url).to.eql('/_admin/api/route/testRoute');
      done();
    });
  });

});
