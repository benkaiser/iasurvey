var should = require('should');
var app = require('../app.js');

// wait for server to start before testing
setTimeout(function(){
  var controller = app.get('controller');
  controller.should.have.property('getSurveys');

  process.exit();
}, 1000);
