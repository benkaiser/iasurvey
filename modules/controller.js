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
  
  //the function below is just for test
  this.createAccount = function(data, callback){
    this.db.staff.save(data, function(err, doc){
    if(err)
      console.log(err);
    callback(doc);
    });
  };
  
  this.manageAccount = function(user_id,callback) {
    this.db.staff.update({_id:this.db.ObjectId(user_id)},{$set:{username:'Changed'}},function(err, numRemoved) {
    if(err)
      console.log(err);
    callback(numRemoved.updatedExisting);
    });
  };
  
  this.removeAccount = function(user_id, callback) {
    this.db.staff.remove({_id: this.db.ObjectId(user_id)}, function(err, numRemoved) {
    if(err)
      console.log(err);
    callback(numRemoved.n);
    });
  };
  
  this.queryResult = function (data, callback){
    this.db.result.find(data,{_id:0,email:1}, function(err, doc){
	//There is still an error here.
	//I don't know how to write this controllers.
	//As I want it to return a value of this collection, not the whole.
	if(err)
	  console.log(err);
    callback(doc);
    });
  };
  
  this.removeResult = function (result_id,callback){
    //this function is for test only as staff can't delete results
    this.db.result.remove ({_id: this.db.ObjectId(result_id)}, function(err, numRemoved){
    if(err)
      console.log(err);
    callback(numRemoved.n);
    });
  };
};
