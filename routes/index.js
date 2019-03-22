const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SSY Nachklausur 2018-04-04' });
});

module.exports = router;
