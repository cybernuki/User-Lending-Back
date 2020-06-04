var express = require('express');
var router = express.Router();

/* GET aspirants. */
router.get('/aspirants', (req, res, next) => {
  res.json({ message: 'retrive all aspirants' })
});

/* GET aspirant. */
router.get('/aspirants/:aspirant_id', (req, res, next) => {
  res.json({ message: 'retrives an specific aspirant' })
});

/* POST aspirants. */
router.post('/aspirants', (req, res, next) => {
  res.json({ message: 'creates a new aspirant' })
});

module.exports = router;
