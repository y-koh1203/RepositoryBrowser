var express = require('express');
var router = express.Router();

var path = require('path');

/* GET home page. */
const routes = ["/", "/repos", "/repos/detail"]

router.get(routes, function(req, res) {
  res.sendFile(path.resolve('public/index.html'));
});

module.exports = router;
