var express = require('express');
var router = express.Router();
var { getAll, getAspirantById, registerAspirant } = require('../controllers/controller.Aspirants');

/* GET aspirants. */
router.get('/aspirants', async (req, res, next) => {
  const aspirants = await getAll()
  return res.json({
    status: 'ok',
    data: aspirants
  })
});

/* GET aspirant. */
router.get('/aspirants/:aspirant_id', async (req, res, next) => {
  const aspirant = await getAspirantById(req.params.aspirant_id)
  const status = (aspirant) ? 'ok' : 'not_found';
  return res.json({
    status: status,
    data: aspirant
  })
});

/* POST aspirants. */
router.post('/aspirants', async (req, res, next) => {
  data = req.body;
  console.log(data);

  if (!data.storeKeeperId || !data.email) return res.status(400).json({ 'message': 'Bad body' });

  let aspirant = await registerAspirant(data);
  let status = (aspirant) ? 'ok' : 'duplicate';
  return res.json({
    status: status,
    data: aspirant
  })
});

module.exports = router;
