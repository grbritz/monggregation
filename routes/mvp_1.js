var express = require('express');
var router = express.Router();
var DB = require('mongodb').Db,
  Server = require('mongodb').Server;

var DBServer = new Server('localhost', 27017);


var mongojs = require('mongojs');


router.get('/', function(req, res) {
  
  var db = new DB('test', DBServer);
  db.open(function(err, db) {
    // Use the admin database for the operation
    var adminDb = db.admin();
    // List all the available databases
    adminDb.listDatabases(function(err, dbs) {
      console.log(dbs.databases);
      db.close();

      res.render('mvp_1', {databases: dbs.databases});
    });
  });
});


router.post('/getCollections', function(req, res) {
  var databaseName = req.query.database;
  var db = new DB(databaseName, new Server('localhost', 27017));
  db.open(function(err, db) {
    db.collections(function(err, collections) {
      var collectionNames = collections.map(function(obj, ind) {
        return obj.s.name;
      });

      console.log(collectionNames);

      res.send(collectionNames);

      db.close();
    });
  });
});

router.post('/', function(req, res) {
  var query = req.body.query;

  db.people.aggregate(query, function(err, docs){
    res.send({"result" : docs});
  });
});

module.exports = router;