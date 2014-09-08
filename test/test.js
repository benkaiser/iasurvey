var should = require('should');
process.env.NODE_ENV = 'mocha';
process.env.DB = 'test_iasurvey';
var app = require('../app.js');
var request = require('supertest');
var passwordHash = require('password-hash');

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

  var result_id = '';

  it('should be able to create a result', function(done) {
    var controller = app.get('controller');
    // test adding a new sample survey
    controller.createResult({test_id: survey_id, email: 'abc@123'}, function(result) {
      result.should.have.property('_id');
      result_id = result._id;
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

  var user_id = '';
  var test_username = 'tester';
  var test_password = 'test';
  var test_password_hash = passwordHash.generate(test_password);

  it('should be able to create an account', function(done){
    var controller = app.get('controller');
    //test adding a new IA staff account
    controller.createAccount({username: test_username, password: test_password_hash}, function(result) {
      result.should.have.property('username');
      user_id = result._id;
      done();
    });
  });

  it('should be able to identify the IA staff', function(done) {
    var controller = app.get('controller');
    //test login function, but I need a complete login function
    controller.getUser(test_username, function(err, result) {
      passwordHash.verify(test_password, result.password).should.be.equal(true);
      done();
    });
  });

  it('should be able to manage an account', function(done) {
    var controller = app.get('controller');
    //test change the name of an existing account
    controller.manageAccount(user_id, function(result) {
      result.should.be.equal(true);
      done();
    });
  });

  it('should be able to remove an account', function(done) {
    var controller = app.get('controller');
    // test removing an account
    controller.removeAccount(user_id, function(result) {
      result.should.be.greaterThan(0);
      done();
    });
  });

  it('should be able to return the e-mail address', function(done) {
    var controller = app.get('controller');
    // Then, check whether we can find that email from the database
    controller.queryResult(result_id, function(result){
      result.email.should.be.equal('abc@123');
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
