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
  //HOMEPAGE
  app.get('/', function(req, res) {
    res.render('landing');
  });

  //ADMIN
  app.get('/admin', function(req, res) {
    if(req.session.loggedIn == false)
      res.render('login');
    else
      res.render('admin');
  });

  /**
   *LOGIN routes and post
   *
   */
  app.get('/login', function(req, res) {
    if(req.session.loggedIn){
      res.render('admin');
    }
    else
      res.render('login');
  });

  app.post('/login', function(req, res) {
    var userName = req.body.txtUserName,
        userPwd = req.body.txtUserPwd,
        isRem = req.body.pwdRem;

    controller.getUser(userName, function (err, results) {
      console.log(results);
        if(results == null)
        {
            res.render('login', {error: 'User does not exist!'});
            return;
        }

         if(passwordHash.verify(userPwd,results.password)==false)
         {
             res.render('login', {error: 'Username or password invalid!'})
             return;
         }
         else
         {
             if(isRem)
             {
                res.cookie('islogin', userName, { maxAge: 60000 });
             }
             req.session.loggedIn = true;
             res.locals.username = userName;
             req.session.username = res.locals.username;
             console.log(req.session.username + ' log in.');
             res.redirect('admin');
             return;
         }
    });
  });
  // LOGOUT
  app.get('/logout', function (req, res) {
      // clear user session
      req.session.loggedIn = false;
      res.render('landing');
  });

/**
 * Staff User management page direct function
 * Direct to /staff or redirect to login page
 */
  app.get('/staff', function(req, res) {
    // if(req.session.loggedIn == false)
    //   res.render('login');
    // else
      res.render('staff');
  });

/**
 * user-create direct function
 * Direct to /user-create or redirect to login page
 */
  app.get('/user-create', function(req, res) {
    // if(req.session.loggedIn == false)
    //   res.render('login');
    // else
      res.render('user-create');
  });

/**
 * user-create post handler
 * Storing {user_name:userName, first_name:firstName, last_name:lastName, email:email}
 * into database
 * @throw save faliure error infomation
 */
  app.post('/user-create', function(req, res) {
    var userName = req.body.uname
        ,firstName = req.body.fname
        ,lastName = req.body.lname
        ,email = req.body.email
        ,isAdmin = req.body.isAdmin;
    controller.createAccount(
      {user_name:userName, first_name:firstName, last_name:lastName, email:email, is_admin:isAdmin},
      function (saved) {
      console.log(saved+" saved");
    });
    res.render('staff-operation-success', {user_uame: 'momomomo'});
  });

/**
 * user-delete direct function
 * Direct to /user-delete or redirect to login page
 */
  app.get('/user-delete', function(req, res) {
    // if(req.session.loggedIn == false)
    //   res.render('login');
    // else
      res.render('user-delete');
  });

/**
 * user-delete post handler
 * Storing {user_name:userName, first_name:firstName, last_name:lastName, email:email}
 * into database
 * @throw delete faliure error infomation
 */
  app.post('/user-delete', function(req, res) {
    var user_id = req.body.userId;
    controller.removeAccount(user_id,
      function (numRemoved) {
      console.log(numRemoved+" Removed");
    });
  });

/**
 * account-update direct function
 * Direct to /account-update or redirect to login page
 */
  app.get('/account-update', function(req, res) {
    // if(req.session.loggedIn == false)
    //   res.render('login');
    // else
      res.render('account-update');
  });
};
