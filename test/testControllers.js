var should = require('should');
process.env.NODE_ENV = 'mocha';
process.env.DB = 'test_iasurvey';
var app = require('../app.js');
var request = require('supertest');
var passwordHash = require('password-hash');
var survey_id = '';
var result_id = '';
var user_id = '';
var test_username = 'tester';
var test_password = 'test';
var test_password_hash = passwordHash.generate(test_password);

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
describe('Tests for Controllers', function() {
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
    db.survey.remove({}, {multi: true}, function(err, numRemoved) {
      (err === null).should.be.equal(true);
      completed();
    });

    // remove all the staff
    db.staff.remove({}, {multi: true}, function(err, numRemoved) {
      (err === null).should.be.equal(true);
      completed();
    });

    // remove all the results
    db.result.remove({}, {multi: true}, function(err, numRemoved) {
      (err === null).should.be.equal(true);
      completed();
    });

    // remove all the logs
    db.log.remove({}, {multi: true}, function(err, numRemoved) {
      (err === null).should.be.equal(true);
      completed();
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

  it('should be able to fetch all surveys', function(done) {
    // get a handle on the controller
    var controller = app.get('controller');
    controller.getSurveys({},function(docs) {
      // ensure it was an array returned
      docs.should.be.instanceof(Array);
      done();
    });
  });

  it('should be able to create a survey', function(done) {
    var controller = app.get('controller');
    // test adding a new sample survey
    controller.createSurvey({title: 'test'}, function(result) {
      result.should.have.property('_id');
      survey_id = result._id;
      done();
    });
  });

  it('should be able to fetch a survey by its ID', function(done) {
    var controller = app.get('controller');
    //test fetching a survey by its ID
    controller.getSurveyBy_id(survey_id, function(result) {
      result.should.have.property('title');
      done();
    });
  });

  it('should be able to create a result', function(done) {
    var controller = app.get('controller');
    // test adding a result for a existing survey
    controller.createResult({test_id: survey_id, email: 'abc@123'}, function(result) {
      result.should.have.property('_id');
      result_id = result._id;
      done();
    });
  });

  it('should be able to fetch all users', function(done) {
    var controller = app.get('controller');
    controller.getAllUser(function(docs) {
      // ensure it was an array returned
      docs.should.be.instanceof(Array);
      done();
    });
  });

  it('should be able to create an account', function(done) {
    var controller = app.get('controller');
    //test adding a new IA staff account
    controller.createAccount({username: test_username, password: test_password_hash, isAdmin: true}, function(result) {
      result.username.should.be.equal(test_username);
      result.password.should.be.equal(test_password_hash);
      result.isAdmin.should.be.equal(true);
      user_id = result._id;
      //console.log(user_id);
      done();
    });
  });

  it('should be able to query for account', function(done) {
    var controller = app.get('controller');
    //test querting for an account
    controller.queryAccount(test_username, function(result) {
      result.should.have.property('username');
      result.should.have.property('password');
      result.should.have.property('isAdmin');
      done();
    });
  });

  it('shuold be able to fetch an account with its username', function(done) {
    var controller = app.get('controller');
    //test querying an existing account with its username
    controller.getUserByName(test_username, function(err, result) {
      result.password.should.be.equal(test_password_hash);
      done();
    });
  });

  it('should be able to fetch an account with its ID', function(done) {
    var controller = app.get('controller');
    //test querying an existing account with its ID
    controller.getUserById(user_id, function(result) {
      result.password.should.be.equal(test_password_hash);
      done();
    });
  });

});
