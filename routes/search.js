const express = require('express');
const router = express.Router();
const getApothecaries = require('./../middleware/apothecas-getter')

/* GET drugs details. */
router.post('/', async function(req, res, next) {
  const apotecas = await getApothecaries(req)
  res.render('result', {
    apothecas: apotecas,
    title: 'Поиск аптеки',
  });
});

module.exports = router;
