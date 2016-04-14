var mongo = require('mongodb').MongoClient;
 var DB = null;

var dbURL = 'mongodb://localhost:27017/mynksh';
var flights = require('../modules/flights.json');

    exports.seed = function(cb) { 
      connect(function(err,DB){  
    var collection = DB.collection('flights');
    collection.count({}, function(err, docs) {
    if (docs > 0){
    cb(err,false);
    }
    else{
    collection.insert(flights,{w:1}, function(err, result) {});
    cb(err,true);
      }
  });
     });
 };


   
    var connect = exports.connect = function(cb) {
        mongo.connect(dbURL, function(err, db) {
            //assert.equal(null, err);
            DB = db;
            cb(err, db);
        });
    };

    var dB = exports.db = function() {
        //assert.notEqual(null, DB);
        return DB;
    };

    exports.clearDB = function(done) {
        DB.listCollections().toArray().then(function(collections) {
            collections.forEach(function(c) {
                DB.collection(c.name).removeMany();
            });
            done();
        }).catch(done);
    };