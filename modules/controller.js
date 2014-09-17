/*
this module manages the data in the surveys and feeds them to the routes
@para <express>app <socket.io>io
@return <object>Controller
*/
module.exports = function Controller(app, io) {

  this.db = app.get('db');

/*
getSurveys
Fetch survey content from database
@para <Object>where <function>callback
*/
  this.getSurveys = function(where, callback) {
    this.db.survey.find(where, function(err, docs) {
      callback(docs);
    });
  };

/*
getSurveys
Fetch survey content from database
@para <Object>data <function>callback
*/
  this.getSurveyBy_id = function(_id, callback) {
    this.db.survey.findOne({_id: this.db.ObjectId(_id)}, function(err, doc) {
      callback(doc);
    });
  };
/*
createSurvey
Sava a survey content into database
@para <Object>data <function>callback
*/
  this.createSurvey = function(data, callback) {
    this.db.survey.save(data, function(err, doc) {
      if(err)
        console.log(err);
      callback(doc);
    });
  };

/*
publishSurvey
Update the status of a survey to active
@para <ObjectId>_id <String>status <function>callback
*/
  this.setSurveyStatus = function(_id, status, callback) {
    this.db.survey.update({_id: this.db.ObjectId(_id)}, {$set: {status: status}}, function(){
      callback();
    });
  };

/*
updateSurvey
Update the contents of a survey
@para <ObjectId>_id <Object>data <function>callback
*/
  this.updateSurvey = function(_id, data, callback) {
    this.db.survey.update({_id: this.db.ObjectId(_id)}, {$set: data}, function(){
      callback();
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
@para <Object>data <function>callback
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
createAccount
Creat IA Staff user account
@para <Object>data <function>callback
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
this is a test function
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
      callback(err, numRemoved.n);
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
getUserByName
this part is to get user information by search username
@para <String>name <function>callback
*/
  this.getUserByName = function(name,callback){
    this.db.staff.findOne({username: name}, function(err,result){
      if (err){
        console.log(err);
        callback(err, null);
      }
      callback(null, result);
    });
  };
/*
getAllUser
this part is to get user information by search username
@para <String>name <function>callback
*/
  this.getAllUser = function(callback){
    this.db.staff.find(function(err,result){
      if (err){
        console.log(err);
        return null;
      }
      callback(result);
    });
  };
/*
getUserById
this part is to get user information by search username
@para <String>name <function>callback
*/
  this.getUserById = function(user_id,callback){
    this.db.staff.findOne({_id: this.db.ObjectId(user_id)}, function(err,result){
      if (err){
        console.log(err);
        return null;
      }
      callback(result);
    });
  };
/*
updateAccount
Update a existing user by user_id
@para <String>user_id <jsonString>data <function>callback
*/
  this.updateAccount = function(user_id, data, callback) {
    this.db.staff.update({_id:this.db.ObjectId(user_id)}, {$set:data}, function(err, result) {
      if(err)
        console.log(err);
      console.log(result);
      callback(result.ok);
    });
  };
};
