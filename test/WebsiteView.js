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

describe('Website View', function() {
  before(waitOnApp);

  it('should be able to fetch the survey page', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });

  it('should be able to fetch the subscribe page', function(done) {
    request(app)
      .get('/subscribe')
      .expect(200)
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });

  it('should be able to fetch the login page', function(done) {
    request(app)
      .get('/admin/login')
      .expect(200)
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });
});

describe('Login Mask', function() {
  before(waitOnApp);

  it('should not be able to fetch the admin index without login', function(done) {
    request(app)
      .get('/admin')
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });

  it('should not be able to fetch the password-update page without login', function(done) {
    request(app)
      .get('/admin/password-update')
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });

  it('should not be able to fetch the survey manage page without login', function(done) {
    request(app)
      .get('/admin/surveys')
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });

  it('should not be able to fetch the survey create page without login', function(done) {
    request(app)
      .get('/admin/surveys/create')
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });

  it('should not be able to fetch the staff manage page without login', function(done) {
    request(app)
      .get('/admin/staff')
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });

  it('should not be able to fetch the staff create page without login', function(done) {
    request(app)
      .get('/admin/staff/create')
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
      should.not.exist(err);
      done();
      });
  });
});
