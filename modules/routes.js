// this module creates all the individial routes for the server
var db = null;
var controller = null;

module.exports = function(app, io) {
  db = app.get('db');
  controller = app.get('controller');

  // define the routes
  app.get('/', function(req, res) {
    res.render('landing');
  });
  // landing page for staff
  app.get('/admin', function(req, res) {
    res.send('stub for staff login page');
  });
};
