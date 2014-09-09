/*
this module manages the data in the surveys and feeds them to the routes
@para <express>app <socket.io>io
@return function
*/
module.exports = function Controller(app, io) {

  this.db = app.get('db');

/*
getSurveys
Fetch survey content from database
@para <json>data <function>callback
*/
  this.getSurveys = function(callback) {
    this.db.survey.find({}, function(err, docs) {
      callback(docs);
    });
  };
/*
createSurvey
Sava a survey content into database
@para <json>data <function>callback
*/
  this.createSurvey = function(data, callback) {
    this.db.survey.save(data, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };
/*
removeSurvey
Remove a survey from database
@para <String>survey_id <function>callback
*/
  this.removeSurvey = function(survey_id, callback) {
    this.db.survey.remove({_id: this.db.ObjectId(survey_id)}, function(err, numRemoved) {
      if(err)
        console.log(err);
      callback(numRemoved.n);
    });
  };
/*
createResult
Remove a survey from database
@para <json>data <function>callback
*/
  this.createResult = function(data, callback) {
    this.db.result.save(data, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };
/*
log
Record system log
@para <String>msg <function>callback
*/
  this.log = function(msg, callback){
    this.db.log.save({msg: msg}, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };
/*
This function below is just for test
createAccount
@para <json>data <function>callback
*/
  this.createAccount = function(data, callback) {
    this.db.staff.save(data, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };
/*
manageAccount
Update a existing user name to 'Changed' by user_id
@para <String>user_id <function>callback
*/
  this.manageAccount = function(user_id, callback) {
    this.db.staff.update({_id:this.db.ObjectId(user_id)}, {$set:{username:'Changed'}}, function(err, numRemoved) {
      if(err)
        console.log(err);
      callback(numRemoved.updatedExisting);
    });
  };
/*
removeAccount
Remove a user account by user_id
@para <String>user_id <function>callback
*/
  this.removeAccount = function(user_id, callback) {
    this.db.staff.remove({_id: this.db.ObjectId(user_id)}, function(err, numRemoved) {
      if(err)
        console.log(err);
      callback(numRemoved.n);
    });
  };
/*
queryResult
@para <jsonString>data <function>callback
*/
  this.queryResult = function (data, callback) {
    this.db.result.findOne(data, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };
/*
removeResult
this part is to get user information by search username
@para <String>name <function>callback
*/
  this.getUser = function(name,callback){
    this.db.staff.findOne({username: name}, function(err,result){
      if (err){
        console.log(err);
        return null;
      }
      callback(null,result);
    });
  };

};
