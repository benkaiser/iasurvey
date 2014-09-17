/**
 * This module creates all the individial routes for the server
 * @para <express>app <socket.io>io
 * @return <>function
 */
var db = null;
var controller = null;
var passwordHash = require('password-hash');

module.exports = function(app, io) {
  db = app.get('db');
  controller = app.get('controller');
  // homepage
  app.get('/', function(req, res) {
    res.render('landing');
  });

  // admin
  app.get('/admin', loginMask, function(req, res) {
    res.render('admin');
  });

  /**
   * login routes and post
   *
   */
  app.get('/admin/login', function(req, res) {
    // if they want to be logged out
    if(req.query.hasOwnProperty('logout')){
      delete req.session.loggedIn;
      delete req.session.username;
      delete req.session.isAdmin;
    }
    if(req.session.loggedIn){
      res.render('admin', {loggedIn: true, isAdmin: req.session.isAdmin, username: res.locals.isAdmin});
    } else {
      res.render('login');
    }
  });

  app.post('/admin/login', function(req, res) {
    var userName = req.body.txtUserName,
        userPwd = req.body.txtUserPwd,
        isRem = req.body.pwdRem;
        if(userName.length === 0){
          res.render('login', {error: 'User name can not be empty.'});
          return;
        } if(userPwd.length === 0){
          res.render('login', {error: 'Password can not be empty.'});
          return;
        }

    controller.getUserByName(userName, function (err, result) {
      console.log(result);
        if(result === null){
            res.render('login', {error: 'User does not exist!'});
            return;
        } if(passwordHash.verify(userPwd,result.password) === false) {
             res.render('login', {error: 'Username or password invalid!'});
             return;
         } else {
             req.session.loggedIn = true;
             req.session.username = result.username;
             req.session.isAdmin = result.is_admin;
             res.redirect('/admin');
             return;
         }
    });
  });

  app.get('/admin/surveys', loginMask, function(req, res) {
    controller.getSurveys(function(surveys){
      res.render('surveys', {surveys: surveys});
    });
  });

  app.get('/admin/surveys/create', loginMask, function(req, res) {
    res.render('survey_create');
  });

  app.get('/admin/surveys/edit/:id', loginMask, function(req, res) {
    controller.getSurveyBy_id(req.params.id, function(doc){
      if(doc) {
        // found the doc, render the edit page
        if(req.query.clone){
          console.log("Cloning");
          res.render('survey_create', {survey: doc});
        } else {
          console.log("Editing");
          // only pass the edit flag if we aren't cloning
          res.render('survey_create', {survey: doc, edit: true});
        }
      } else {
        // redirect back to manage page
        res.redirect('/admin/surveys');
      }
    });
  });

  app.post('/admin/surveys/create', loginMask, function(req, res) {
    if(req.body.title) {
      // form was submitted and data present, save the data
      var doc = {
        title: req.body.title,
        prompt: req.body.prompt,
        end_page: req.body.end_page_html,
        form: req.body.form_json,
        status: 'draft'
      };
      if(req.body.edit) {
        // if edit was passed in, it contains the _id
        controller.updateSurvey(req.body.edit, doc, function(data) {
          res.redirect('/admin/surveys');
        });
      } else {
        // add it as a new document
        controller.createSurvey(doc, function(data) {
          res.redirect('/admin/surveys');
        });
      }
    } else {
      // render the manage page
      res.redirect('/admin/surveys');
    }
  });

  app.get('/admin/surveys/publish/:id', loginMask, function(req, res){
    controller.setSurveyStatus(req.params.id, 'active', function(){
      // render the manage page again with the updated data
      res.redirect('/admin/surveys');
    });
  });

  app.get('/admin/surveys/deactivate/:id', loginMask, function(req, res){
    controller.setSurveyStatus(req.params.id, 'deactive', function(){
      // render the manage page again with the updated data
      res.redirect('/admin/surveys');
    });
  });

  app.get('/admin/surveys/activate/:id', loginMask, function(req, res){
    controller.setSurveyStatus(req.params.id, 'active', function(){
      // render the manage page again with the updated data
      res.redirect('/admin/surveys');
    });
  });

/**
 * Staff User management page direct function
 * Direct to /admin/staff or redirect to login page
 */
  app.get('/admin/staff', loginMask, adminMask, function(req, res) {
    res.render('staff');
  });

/**
 * user-create direct function
 * Direct to /user-create or redirect to login page
 */
  app.get('/admin/user-create', loginMask, adminMask, function(req, res) {
    res.render('user-create');
  });

/**
 * user-create post handler
 * Storing {user_name:userName, first_name:firstName, last_name:lastName, email:email}
 * into database
 * @throw save faliure error infomation
 */
  app.post('/admin/user-create', loginMask, adminMask, function(req, res) {
    var userName = req.body.uname,
        password = req.body.password,
        isAdmin = req.body.isAdmin,
        hashedPw = passwordHash.generate(password);
    if (typeof isAdmin === 'undefined') {
      isAdmin = "User";
    }
    controller.createAccount(
      {username:userName, password:hashedPw, is_admin:isAdmin},
      function (saved) {
      console.log(JSON.stringify(saved) + " saved");
    });
    res.render('staff-operation-success', {title: "User Create Successful", buttonValue: "ContinueCreate", page: "/admin/user-create"});
  });

/**
 * user-delete direct function
 * Direct to /user-delete or redirect to login page
 */
  app.get('/admin/user-delete', loginMask, adminMask, function(req, res) {
    controller.getAllUser(
      function (users) {
        res.render('user-delete', {users: users});
      }
    );
  });

/**
 * user-delete post handler
 * Storing {user_name:userName, first_name:firstName, last_name:lastName, email:email}
 * into database
 * @throw delete faliure error infomation
 */
  app.post('/admin/user-delete', loginMask, adminMask, function(req, res) {
    var userChoosen = req.body.userChoosen;
    if( typeof userChoosen === 'string' ) {
      controller.removeAccount(userChoosen,
        function (err, numRemoved) {
        console.log(numRemoved+" Removed");
        if(!err){
          res.render('staff-operation-success', {title: "User Delete Successful", buttonValue: "ContinueDelete", page: "/admin/user-delete"});
        }
      });
    } else {
      userChoosen.forEach(function(userId) {
        controller.removeAccount(userId,
          function (err, numRemoved) {
          console.log(numRemoved+" Removed");
          if(err != null){
            return;
          }
        });
      });
      res.render('staff-operation-success', {title: "User Delete Successful", buttonValue: "ContinueDelete", page: "/admin/user-delete"});
    }
  });

/**
 * account-update get handler
 * Direct to /account-update or redirect to login page
 */
  app.get('/admin/account-update', loginMask, adminMask, function(req, res) {
    controller.getAllUser(
      function (users) {
        res.render('account-update', {users: users});
      }
    );
  });
/**
 * account-update post handler
 */
  app.get('/admin/account-edit/:id', loginMask, adminMask, function(req, res) {
    var userId = req.params.id;
    controller.getUserById(userId,
      function (user) {
        res.render('account-edit', {user: user});
      }
    );
  });
/**
 * account-edit post handler
 */
  app.post('/admin/account-edit', loginMask, adminMask, function(req, res) {
    var userId = req.body.userId,
        userName = req.body.uname,
        password = req.body.password,
        isAdmin = req.body.isAdmin;
    if (typeof isAdmin === 'undefined') {
      isAdmin = "User";
    }
    if(password==""){
      var data = {username:userName, is_admin:isAdmin};
    } else {
      var data = {username:userName, password:passwordHash.generate(password), is_admin:isAdmin};
    }
    controller.updateAccount(userId, data,
      function (result) {
        if(result === true){
          res.render('staff-operation-success', {title: "Account Update Successful", buttonValue: "ContinueUpdate", page: "/admin/account-update"});
        }
      }
    );
  });
/**
 * password-update get handler
 * Direct to /account-update or redirect to login page
 */
  app.get('/admin/password-update', loginMask, function(req, res) {
      res.render('password-update');
  });
/**
 * password-update post handler
 */
  app.post('/admin/password-update', loginMask, function(req, res) {
    var username = req.body.username,
        oldPw = req.body.oldpw,
        newPw = req.body.newpw;
    //Verify old password
    controller.getUserByName(username,
      function (nullfunc, user) {
        if(!passwordHash.verify(oldPw, user.password)){
          res.render('password-update', {username: username, error: 'Please enter the correct old password!'});
          return;
        }
        var hashedNewPw = passwordHash.generate(newPw),
            data = {password: hashedNewPw};
        controller.updateAccount(user._id.toString(), data,
          function (result) {
            if(result == true){
              res.render('staff-operation-success', {title: "Password Update Successful"});
            }
          }
        );
      }
    );
  });
};

var loginMask = function(req, res, next){
  if(req.session.loggedIn) {
    res.locals.loggedIn = true;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.username = req.session.username;
    next();
  } else {
    res.redirect('/admin/login');
  }
};

var adminMask = function(req, res, next){
  if(!req.session.isAdmin) {
    res.redirect('/admin');
  } else {
    next();
  }
};
