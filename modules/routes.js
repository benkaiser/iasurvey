// this module creates all the individial routes for the server
var db = null;
var controller = null;
var passwordHash = require('password-hash');
var islogin = false;

module.exports = function(app, io) {
  db = app.get('db');
  controller = app.get('controller');

  //HOMEPAGE
  app.get('/', function(req, res) {
    res.render('landing');
  });

  //ADMIN
  app.get('/admin', function(req, res) {
    if(islogin == false)
      res.render('login');
    else
      res.render('admin');
  });

  //LOGIN
  app.get('/login', function(req, res) {
    if(req.session.islogin){
      res.locals.islogin = req.session.islogin;
      res.render('admin');
    }
    res.render('login');
  });

  app.post('/login', function(req, res) {
    var userName = req.body['txtUserName'],
        userPwd = req.body['txtUserPwd'],
        isRem = req.body['pwdRem'];

    controller.getUser(userName, function (err, results) { 
        if(results == null)
        {
            res.locals.error = 'User does not exist.';
            console.log('User does not exist.');
            res.render('login');
            return;
        }

         if(passwordHash.verify(userPwd,results.password)==false)
         {
             res.locals.error = 'Username or password invalid.';
             console.log('Username or password invalid.');
             res.render('login');
             return;
         }
         else
         {
             if(isRem)
             {
                res.cookie('islogin', userName, { maxAge: 60000 });                 
             }
             islogin = true;
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
        islogin = false;
        res.render('landing');
    });

};
