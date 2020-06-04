var express = require('express');
var router = express.Router();

/* GET aspirants. */
router.get('/investors', (req, res, next) => {
  res.json({ message: 'retrive all aspirants' })
});

/* GET aspirant. */
router.get('/investors/:investor_id', (req, res, next) => {
  res.json({ message: 'retrives an specific aspirant' })
});

/* POST aspirants. */
router.post('/investors', (req, res, next) => {
  console.log(req.body);
  return res.json(req.body);
});

module.exports = router;
