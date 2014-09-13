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
      delete req.session.user;
    }
    if(req.session.loggedIn){
      res.render('admin');
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

    controller.getUserByName(userName, function (err, results) {
      console.log(results);
        if(results === null){
            res.render('login', {error: 'User does not exist!'});
            return;
        } if(passwordHash.verify(userPwd,results.password) === false) {
             res.render('login', {error: 'Username or password invalid!'});
             return;
         } else {
             req.session.loggedIn = true;
             req.session.username = res.locals.username;
             console.log(req.session.username + ' log in.');
             res.redirect('/admin');
             return;
         }
    });
  });

/**
 * Staff User management page direct function
 * Direct to /admin/staff or redirect to login page
 */
  app.get('/admin/staff', loginMask, function(req, res) {
    res.render('staff');
  });

/**
 * user-create direct function
 * Direct to /user-create or redirect to login page
 */
  app.get('/admin/user-create', loginMask, function(req, res) {
    res.render('user-create');
  });

/**
 * user-create post handler
 * Storing {user_name:userName, first_name:firstName, last_name:lastName, email:email}
 * into database
 * @throw save faliure error infomation
 */
  app.post('/admin/user-create', loginMask, function(req, res) {
    var userName = req.body.uname,
        password = req.body.password,
        firstName = req.body.fname,
        lastName = req.body.lname,
        email = req.body.email,
        isAdmin = req.body.isAdmin;
    if (typeof isAdmin === 'undefined') {
      isAdmin = "User";
    }
    controller.createAccount(
      {username:userName, password:password, firstname:firstName, lastname:lastName, email:email, is_admin:isAdmin},
      function (saved) {
      console.log(JSON.stringify(saved) + " saved");
    });
    res.render('staff-operation-success', {title: "User Create Successful", buttonValue: "ContinueCreate", page: "/user-create"});
  });

/**
 * user-delete direct function
 * Direct to /user-delete or redirect to login page
 */
  app.get('/admin/user-delete', loginMask, function(req, res) {
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
  app.post('/admin/user-delete', loginMask, function(req, res) {
    var userChoosen = req.body.userChoosen;
    if( typeof userChoosen === 'string' ) {
      controller.removeAccount(userChoosen,
        function (numRemoved) {
        console.log(numRemoved+" Removed");
      });
      res.render('staff-operation-success', {title: "User Delete Successful", buttonValue: "ContinueDelete", page: "/user-delete"});
    } else {
      userChoosen.forEach(function(userId) {
        controller.removeAccount(userId,
          function (numRemoved) {
          console.log(numRemoved+" Removed");
        });
        res.render('staff-operation-success', {title: "User Delete Successful", buttonValue: "ContinueDelete", page: "/user-delete"});
      });
    }
  });

/**
 * account-update direct function
 * Direct to /account-update or redirect to login page
 */
  app.get('/admin/account-update', loginMask, function(req, res) {
    controller.getAllUser(
      function (users) {
        res.render('account-update', {users: users});
      }
    );
  });
/**
 * account-update post handler
 */
  app.get('/admin/account-edit/:id', loginMask, function(req, res) {
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
  app.post('/admin/account-edit/:id', loginMask, function(req, res) {
    var userId = req.body.userId,
    userName = req.body.uname,
    password = req.body.password,
    firstName = req.body.fname,
    lastName = req.body.lname,
    email = req.body.email,
    isAdmin = req.body.isAdmin;
    var data = {username:userName, password:password, firstname:firstName, lastname:lastName, email:email, is_admin:isAdmin};
    controller.updateAccount(userId, data,
      function (result) {
        if(result === true){
          res.render('staff-operation-success', {title: "Account Update Successful", buttonValue: "ContinueUpdate", page: "/account-update"});
        }
      }
    );
  });
};

var loginMask = function(req, res, next){
  if(req.session.loggedIn) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};
