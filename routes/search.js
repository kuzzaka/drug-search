const express = require('express');
const router = express.Router();
const getApothecaries = require('../middleware/apothecas')
const getTips = require('../middleware/tips')

/* GET drugs details. */
router.post('/', async function(req, res, next) {
  const apotecas = await getApothecaries(req)
  res.render('result', {
    apothecas: apotecas,
    title: 'Поиск аптеки в Екатеринбурге',
  });
});

router.get('/tips/', async function (req, res, next) {
  const tips = await getTips(req.query.qs)
  res.json(tips)
})
module.exports = router;
