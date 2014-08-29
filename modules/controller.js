// this module manages the data in the surveys and feeds them to the routes

module.exports = function Controller(app, io) {

  this.db = app.get('db');

  this.getSurveys = function(callback) {
    this.db.survey.find({}, function(err, docs) {
      callback(docs);
    });
  };

  this.createSurvey = function(data, callback) {

  };

  this.createResult = function(data, callback) {

  };
};
