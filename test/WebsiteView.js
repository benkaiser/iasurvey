var should = require('should');
process.env.NODE_ENV = 'mocha';
process.env.DB = 'test_iasurvey';
var app = require('../app.js');
var request = require('supertest');
var passwordHash = require('password-hash');
var adminUser = request.agent(app);
var testUser = request.agent(app);
// used to wait for app before starting test
var waitOnApp = function(done){
  // wait for the controller to become available
  var checkFinished = function() {
    if(app.get('controller') === undefined) {
      setTimeout(checkFinished, 10);
    } else {
      var controller = app.get('controller');
      //adding a admin user for preparing follow up tests
      controller.getUserByName('adminUser', function (err, result) {
        if(result === null){
          controller.createAccount({username: 'adminUser', password: passwordHash.generate('adminUser'), is_admin: true}, function(result) {
          });
        }
      })

      //adding a normal user for preparing follow up tests
      controller.getUserByName('testUser', function (err, result) {
        if(result === null){
          controller.createAccount({username: 'testUser', password: passwordHash.generate('testUser'), is_admin: false}, function(result) {
          });
        }
      })

      //adding a temporary user for preparing follow up tests
      controller.getUserByName('tempUser', function (err, result) {
        if(result === null){
          controller.createAccount({username: 'tempUser', password: passwordHash.generate('tempUser'), is_admin: false}, function(result) {
          });
        }
      })
      done();
    }
  };
  checkFinished();
};

var deleteTempData = function(){
  var controller = app.get('controller');
  controller.getUserByName('createTestUser', function (err, result) {
    if(result !== null){
      controller.removeAccount(result._id,
        function (err, numRemoved) {
        console.log(numRemoved+" Removed");
      });
    }
  })
}



describe('Non-login user operations', function() {
  before(waitOnApp);
  after(deleteTempData);
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

  it('should not be able to create a new user', function(done) {
    request(app)
      .post('/admin/staff/create')
      .type('form')
      .send({'uname':'createTestUser','password':'createTestUser','isAdmin':true})
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should not be able to fetch the account edit page without login', function(done) {
    var maliciousRandomID = '534ea23da231d323d42rw2da39';
    request(app)
      .get('/admin/account-edit/'+maliciousRandomID)
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });
  it('should not be able to edit selected account', function(done) {
    var controller = app.get('controller');
    controller.getUserByName('tempUser', function (err, result) {
      request(app)
        .post('/admin/account-edit/'+result._id)
        .type('form')
        .send({'uname':'tempUser','password':'tempUserModified','isAdmin':false})
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /admin/login')
        .end(function (err, res){
          should.not.exist(err);
          done();
        });
    })
  });

  it('should not be able to delete the selected user without login', function(done) {
    var maliciousRandomID = '534ea23da231d323d42rw2da39';
    request(app)
      .get('/admin/staff/delete/:id'+maliciousRandomID)
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/login')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });
});

describe('Admin user operations', function() {
  before(waitOnApp);
  after(deleteTempData);

  it('should be able to log in the system and redirecting to admin', function(done) {
    adminUser
      .post('/admin/login')
      .type('form')
      .send({'txtUserName':'adminUser','txtUserPwd':'adminUser'})
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should be able to fetch the admin page', function(done) {
    adminUser
      .get('/admin')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should be able to fetch the surveys page', function(done) {
    adminUser
      .get('/admin/surveys')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should be able to fetch the survey create page', function(done) {
    adminUser
      .get('/admin/surveys/create')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should not be able to fetch the password-update page', function(done) {
    adminUser
      .get('/admin/password-update')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should be able to fetch the staff manage page', function(done) {
    adminUser
      .get('/admin/staff')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });
  /**
   * User Create page get/post handler test
   */
  it('should be able to fetch the staff create page', function(done) {
    adminUser
      .get('/admin/staff/create')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });
  it('should be able to create a new user', function(done) {
    adminUser
      .post('/admin/staff/create')
      .type('form')
      .send({'uname':'createTestUser','password':'createTestUser','isAdmin':true})
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin/staff')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  /**
   *account-edit page get/post handler test
   */
  it('should be able to fetch account-edit page', function(done) {
    var controller = app.get('controller');
    controller.getUserByName('adminUser', function (err, result) {
      adminUser
        .get('/admin/account-edit/'+result._id)
        .expect(200)
        .end(function (err, res){
          should.not.exist(err);
          done();
        });
    })
  });
  it('should be able to edit selected account', function(done) {
    var controller = app.get('controller');
    controller.getUserByName('tempUser', function (err, result) {
      adminUser
        .post('/admin/account-edit/'+result._id)
        .type('form')
        .send({'uname':'tempUser','password':'tempUserModified','isAdmin':false})
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /admin/staff')
        .end(function (err, res){
          should.not.exist(err);
          done();
        });
    })
  });
  /**
   * delete manipulations
   */
  it('should be able to delete the selected user', function(done) {
    var controller = app.get('controller');
    controller.getUserByName('tempUser', function (err, result) {
      adminUser
        .get('/admin/staff/delete/'+result._id)
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /admin/staff')
        .end(function (err, res){
          should.not.exist(err);
          done();
        });
    })
  });
  it('should not be able to delete user itselt', function(done) {
    var controller = app.get('controller');
    controller.getUserByName('adminUser', function (err, result) {
      adminUser
        .get('/admin/staff/delete/'+result._id)
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /admin')
        .end(function (err, res){
          should.not.exist(err);
          done();
        });
    })
  });

});


describe('Normal user operations', function() {
  before(waitOnApp);
  after(deleteTempData);
  
  it('should be able to log in the system and redirecting to admin', function(done) {
    testUser
      .post('/admin/login')
      .type('form')
      .send({'txtUserName':'testUser','txtUserPwd':'testUser'})
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should be able to fetch the admin page', function(done) {
    testUser
      .get('/admin')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should be able to fetch the surveys page', function(done) {
    testUser
      .get('/admin/surveys')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should be able to fetch the survey create page', function(done) {
    testUser
      .get('/admin/surveys/create')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should be able to fetch the password-update page', function(done) {
    testUser
      .get('/admin/password-update')
      .expect(200)
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  it('should not be able to fetch the staff manage page', function(done) {
    testUser
      .get('/admin/staff')
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });

  /**
   *staff create get/post handler test
   */
  it('should not be able to fetch the staff create page', function(done) {
    testUser
      .get('/admin/staff/create')
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });
  it('should not be able to create a new user', function(done) {
    testUser
      .post('/admin/staff/create')
      .type('form')
      .send({'uname':'createTestUser','password':'createTestUser','isAdmin':true})
      .expect(302)
      .expect('Moved Temporarily. Redirecting to /admin')
      .end(function (err, res){
        should.not.exist(err);
        done();
      });
  });
  /**
   *account-edit page get/post handler test
   */
  it('should not be able to fetch account-edit page', function(done) {
    var controller = app.get('controller');
    controller.getUserByName('testUser', function (err, result) {
      testUser
        .get('/admin/account-edit/'+result._id)
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /admin')
        .end(function (err, res){
          should.not.exist(err);
          done();
        });
    })
  });
  it('should not be able to edit selected account', function(done) {
    var controller = app.get('controller');
    controller.getUserByName('tempUser', function (err, result) {
      testUser
        .post('/admin/account-edit/'+result._id)
        .type('form')
        .send({'uname':'tempUser','password':'tempUserModified','isAdmin':false})
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /admin')
        .end(function (err, res){
          should.not.exist(err);
          done();
        });
    })
  });
  /**
   * User delete handler test
   */
  it('should not be able to delete the selected user', function(done) {
    var controller = app.get('controller');
    controller.getUserByName('tempUser', function (err, result) {
      testUser
        .get('/admin/staff/delete/'+result._id)
        .expect(302)
        .expect('Moved Temporarily. Redirecting to /admin')
        .end(function (err, res){
          should.not.exist(err);
          done();
        });
    })
  });
});
