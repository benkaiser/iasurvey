/*
This module creates all the individial routes for the server
@para <express>app <socket.io>io
@return function
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

  //LOGIN
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

};
