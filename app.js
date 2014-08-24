var path = require('path');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
// needed for session storage
var MongoStore = require('connect-mongo')(session);
// custom modules
var Controller = require("./modules/controller");

var mongo_connection_string = 'mongodb://127.0.0.1:27017/iasurvey';

var db = mongojs(mongo_connection_string, ['staff', 'survey', 'result', 'log']);

require('./modules/db_init')(db, function() {

  // start the app now that we have the db
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  // set db variables
  app.set('db', db);
  app.set('controller', new Controller(app, io));
  // all environments
  app.set('port', process.env.PORT || 2000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'html');
  app.set('root', __dirname);
  app.engine('html', require('swig').renderFile);
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(session({
    secret: "encryptionsecretforissurvey",
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      db: db.client
    })
  }));
  app.use(cookieParser());
  app.use('/static', express.static(__dirname + '/static'));

  require("./modules/routes")(app, io);

  http.listen(app.get('port'), function() {
    console.log('listening on ' + app.get('port'));
  });

});
