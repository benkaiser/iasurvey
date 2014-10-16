var passwordHash = require('password-hash');
/**
   * this module initialise the db if it hasn't already
   * @para <mongojs>db <function>callback
   */
module.exports = function(db, callback) {
  db.staff.count(function(err, count) {
    if (!err && count === 0) {
      // create the default staff
      db.staff.insert([
        {id: 0, username: 'dev', password: passwordHash.generate('SecretDevPass'), is_admin: true},
        {id: 1, username: 'admin', password: passwordHash.generate('iaadminpass'), is_admin: true}
        ], function(err, docs) {
          if(process.env.NODE_ENV != 'mocha'){
            console.log('Added staff:');
            console.log(docs);
          }
          callback();
        });
    } else {
      callback();
    }
  });
};
