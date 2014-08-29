var should = require('should');
process.env.NODE_ENV = 'mocha';
var app = require('../app.js');

// wait for server to start before testing
describe('Controller', function() {
  before(function(done) {
    // wait for the controller to become available
    var checkFinished = function() {
      if(app.get('controller') === undefined) {
        setTimeout(checkFinished, 10);
      } else {
        done();
      }
    };
    checkFinished();
  });

  it('should be able to fetch surveys', function(done) {
    // get a handle on the controller
    var controller = app.get('controller');
    controller.getSurveys(function(docs) {
      // ensure it was an array returned
      docs.should.be.instanceof(Array);
      done();
    });
  });

  it('should be able to create a survey', function(done) {
    var controller = app.get('controller');
    // TODO: run function on controller, then test the survey added was returned
  });

  it('should be able to submit a result', function(done) {
    var controller = app.get('controller');
    // TODO: run function on controller, then test the result added was returned
  });
});
