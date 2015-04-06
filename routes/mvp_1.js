var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('test');

router.get('/', function(req, res) {
  res.render('mvp_1');
});

router.post('/', function(req, res) {
  var query = req.body.query;

  db.people.aggregate(query, function(err, docs){
    res.send({"result" : docs});
  });
});

module.exports = router;
