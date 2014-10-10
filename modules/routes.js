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
    controller.getSurveys({status: 'active'}, function(surveys){
      res.render('landing', {surveys: surveys});
    });
  });

  app.get('/survey/:id', function(req, res) {
    controller.getSurveyBy_id(req.params.id, function(survey) {
      res.render('complete_survey', {survey: survey});
    });
  });

  app.post('/survey/submit', function(req, res){
    if(req.body !== null){
      controller.SurveySubmit(req.body, function(data){
        res.send("OK");
      });
    }
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
    controller.getSurveys({}, function(surveys){
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
        form: JSON.parse(req.body.form_json),
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
 * IA staff can view survey results
 */
  app.get('/admin/results', loginMask, function(req, res) {
    controller.getSurveys({}, function(surveys){
      res.render('results', {surveys: surveys});
    });
  });

/**
 * staff get handler
 * Direct to /staff or redirect to login page
 */
  app.get('/admin/staff', loginMask, adminMask, function(req, res) {
    controller.getAllUser(
      function (users) {
        res.render('staff', {users: users});
      }
    );
  });

/**
 * user-create direct function
 * Direct to /user-create or redirect to login page
 */
  app.get('/admin/staff/create', loginMask, adminMask, function(req, res) {
    res.render('user-create');
  });

/**
 * user-create post handler
 * Storing {user_name:userName, first_name:firstName, last_name:lastName, email:email}
 * into database
 * @throw save faliure error infomation
 */
  app.post('/admin/staff/create', loginMask, adminMask, function(req, res) {
    var userName = req.body.uname,
        password = req.body.password,
        isAdmin,
        hashedPw = passwordHash.generate(password);

    if(req.body.isAdmin === undefined) {
      isAdmin = false;
    } else {
      isAdmin = true;
    }
    controller.queryAccount(userName, function(queryResult) {
      if(queryResult === null) {
        controller.createAccount(
      {username: userName, password: hashedPw, is_admin: isAdmin},
      function (saved) {
      console.log(JSON.stringify(saved) + " saved");
      res.redirect('/admin/staff');
      });
      } else {
        res.render('user-create', {error: 'This username has existed!'});
      }
    });

  });

/**
 * user-delete post handler
 * Storing {user_name:userName, first_name:firstName, last_name:lastName, email:email}
 * into database
 * @throw delete faliure error infomation
 */
  app.get('/admin/staff/delete/:id', loginMask, adminMask, function(req, res) {
    var userChoosen = req.params.id;
    controller.removeAccount(userChoosen,
      function (err, numRemoved) {
      console.log(numRemoved+" Removed");
      if(!err){
        res.redirect('/admin/staff');
      }
    });
  });

/**
 * staff post handler
 */
  app.get('/admin/account-edit/:id', loginMask, adminMask, function(req, res) {
    var userId = req.params.id;
    controller.getUserById(userId,
      function (user) {
        if(user)
          res.render('account-edit', {user: user});
        else
          res.redirect('/admin/staff');
      }
    );
  });
/**
 * account-edit post handler
 */
  app.post('/admin/account-edit/:id', loginMask, adminMask, function(req, res) {
    var userId = req.params.id,
        userName = req.body.uname,
        password = req.body.password,
        isAdmin;
    if(req.body.isAdmin === undefined) {
      isAdmin = false;
    } else {
      isAdmin = true;
    }
    var data;
    if(password){
      data = {username:userName, password:passwordHash.generate(password), is_admin:isAdmin};
    } else {
      data = {username:userName, is_admin:isAdmin};
    }
    controller.updateAccount(userId, data,
      function (result) {
        if(result === true){
          res.redirect('/admin/staff');
        }
      }
    );
  });
/**
 * password-update get handler
 * Direct to /staff or redirect to login page
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
          res.render('password-update', {username: username, error: 'Please enter the correct old password'});
          return;
        }
        var hashedNewPw = passwordHash.generate(newPw),
            data = {password: hashedNewPw};
        controller.updateAccount(user._id.toString(), data,
          function (result) {
            if(result){
              res.redirect('/admin/staff');
            }
          }
        );
      }
    );
  });
/**
 * survey participants can subscribe further information
 */
  app.get('/subscribe', function(req,res){
    res.render('subscribe');
  });
/**
 * get user's email address and save
 */
  app.post('/subscribe', function(req, res){
    var email = req.body.txtEmail;
    if(req.body.isAgree === undefined){
      res.render('subscribe', {error: 'Must agree to the terms of use before subscribe!'});
      return;
    } else {
      controller.verifyExist(email, function(err, result) {
        console.log('Error:'+err+' Result:'+result);
        if(err){
          res.render('subscribe', {error: 'Illegal email address!'});
          return;
        } if(result !== null) {
          res.render('subscribe', {error: 'You have already subscribe!'});
          return;
        }
        if(!err && result === null)
          controller.insertEmail(email, function(err, result){
            if(err === null)
              res.render('subscribe', {success: 'Thanks for subscribe our latest information'});
          });
      });
    }
  });
/**
 * survey participants can unsubscribe from a link in the received email
 */
  app.get('/unsubscribe', function(req, res){
    res.render('unsubscribe');
  });
/**
 * remove user's email address from subscription list
 */
  app.post('/unsubscribe', function(req, res){
    var email = req.body.txtEmail;
    if(email.length === 0){
      res.render('unsubscribe', {error: 'Input can not be empty!'});
      return;
    } else {
      controller.verifyExist(email, function(err, result) {
        console.log('Error:'+err+' Result:'+result);
        if(err){
          res.render('unsubscribe', {error: 'Illegal email address!'});
          return;
        } if(result === null){
          res.render('unsubscribe', {error: 'Email address not found in subscribe list!'});
          return;
        } if(result !== null)
          controller.deleteEmail(email, function(err, result){
            if(err === null)
              res.render('unsubscribe', {success: 'Unsubscribe success!'});
          });
      });
    }
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
