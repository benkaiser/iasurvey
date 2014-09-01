var should = require('should');
process.env.NODE_ENV = 'mocha';
process.env.DB = 'test_iasurvey';
var app = require('../app.js');
var request = require('supertest');

// used to wait for app before starting test
var waitOnApp = function(done){
  // wait for the controller to become available
  var checkFinished = function() {
    if(app.get('controller') === undefined) {
      setTimeout(checkFinished, 10);
    } else {
      done();
    }
  };
  checkFinished();
};

// wait for server to start before testing
describe('IA Controller', function() {
  before(waitOnApp);

  it('should be able to clear the database', function(done) {
    // get a handle on the controller
    var db = app.get('db');

    // setup a function to call only when all callbacks have returned
    var todo = 4;
    var completed = function(){
      if(--todo === 0){
        done();
      }
    };

    // remove all the surveys
    db.survey.remove({}, {multi: true}, function(err, numRemoved){
      (err === null).should.be.equal(true);
      completed();
    });

    // remove all the staff
    db.staff.remove({}, {multi: true}, function(err, numRemoved){
      (err === null).should.be.equal(true);
      completed();
    });

    // remove all the results
    db.result.remove({}, {multi: true}, function(err, numRemoved){
      (err === null).should.be.equal(true);
      completed();
    });

    // remove all the logs
    db.log.remove({}, {multi: true}, function(err, numRemoved){
      (err === null).should.be.equal(true);
      completed();
    });
  });

  it('should be able to fetch all surveys', function(done) {
    // get a handle on the controller
    var controller = app.get('controller');
    controller.getSurveys(function(docs) {
      // ensure it was an array returned
      docs.should.be.instanceof(Array);
      done();
    });
  });

  var survey_id = '';

  it('should be able to create a survey', function(done) {
    var controller = app.get('controller');
    // test adding a new sample survey
    controller.createSurvey({title: 'test'}, function(result) {
      result.should.have.property('_id');
      survey_id = result._id;
      done();
    });
  });

  it('should be able to submit a result', function(done) {
    var controller = app.get('controller');
    // test adding a new sample survey
    controller.createResult({test_id: survey_id}, function(result) {
      result.should.have.property('_id');
      done();
    });
  });

  it('should be able to remove a survey', function(done) {
    var controller = app.get('controller');
    // test adding a new sample survey
    controller.removeSurvey(survey_id, function(result) {
      result.should.be.greaterThan(0);
      done();
    });
  });

  it('should be able to create a log', function(done) {
    var controller = app.get('controller');
    // test adding a new sample survey
    controller.log('test', function(result) {
      result.should.have.property('_id');
      result.msg.should.be.equal('test');
      done();
    });
  });
});

describe('Website View', function() {
  before(waitOnApp);

  it('should be able to fetch the home page', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(){
        done();
      });
  });
});
