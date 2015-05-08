var _ = require("underscore-node");
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
      db.close();
      res.render('mvp_1', {databases: dbs.databases});
    });
  });
});


router.post('/getCollections', function(req, res) {
  var databaseName = req.body.database;
  var db = new DB(databaseName, DBServer);
  db.open(function(err, db) {
    db.collections(function(err, collections) {
      var collectionNames = collections.map(function(obj, ind) {
        return obj.s.name;
      });
      res.send(collectionNames);
      db.close();
    });
  });
});

router.post('/getSchema', function(req, res) {
  var dbName = req.body.database;
  var collName = req.body.collection;
  var db = new DB(dbName, DBServer);

  db.open(function(err, db) {
    var collection = db.collection(collName);

    collection.findOne(function(err, doc) {
      var schema = {};
      Object.keys(doc).forEach(function(key) {
        schema[key] = typeof(doc[key]);
      });

      res.send(schema);
      db.close();
    });
  });
});

router.post("/runQuery", function(req, res) {
  var dbName = req.body.database;
  var collName = req.body.collection;
  var query = JSON.parse(req.body.query);

  console.log(dbName);
  console.log(query[0]);
  var db = new DB(dbName, DBServer);
  db.open(function(err, db) {
    var collection = db.collection(collName);
    console.log("databse opend");
    collection.aggregate(query, function(err, docs) {
      console.log("aggregate");
      console.log(docs);
      res.send(docs);
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
