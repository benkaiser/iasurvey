// this module manages the data in the surveys and feeds them to the routes

module.exports = function Controller(app, io) {

  this.db = app.get('db');

  this.getSurveys = function(callback) {
    this.db.survey.find({}, function(err, docs) {
      callback(docs);
    });
  };

  this.createSurvey = function(data, callback) {
    this.db.survey.save(data, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };

  this.removeSurvey = function(survey_id, callback) {
    this.db.survey.remove({_id: this.db.ObjectId(survey_id)}, function(err, numRemoved) {
      if(err)
        console.log(err);
      callback(numRemoved.n);
    });
  };

  this.createResult = function(data, callback) {
    this.db.result.save(data, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };

  this.log = function(msg, callback){
    this.db.log.save({msg: msg}, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };
};
