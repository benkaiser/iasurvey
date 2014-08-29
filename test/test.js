var should = require('should');
process.env.NODE_ENV = 'mocha';
var app = require('../app.js');

// wait for server to start before testing
describe('Controller', function(){
  before(function(done){
    // wait for the controller to become available
    var checkFinished = function(){
      if(app.get('controller') === undefined){
        setTimeout(checkFinished, 10);
      } else {
        done();
      }
    };
    checkFinished();
  });

  it('should be able to fetch surveys', function(done){
    var controller = app.get('controller');
    controller.getSurveys(function(docs){
      docs.should.be.instanceof(Array);
      done();
    });
  });
});
