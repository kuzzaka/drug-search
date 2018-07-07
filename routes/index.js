const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Поиск аптеки в Екатеринбурге' });
});

module.exports = router;
