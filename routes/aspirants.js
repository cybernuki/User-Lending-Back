var express = require('express');
var router = express.Router();
var { getAll, getAspirantById, registerAspirant } = require('../controllers/controller.Aspirants');

/** GET aspirants. 
 * This route returns all aspirants saved in the db
 * response's body:
 * {
 *  status: 'ok',
 *  data: [aspirants]
 * }
*/
router.get('/aspirants', async (req, res, next) => {
  const aspirants = await getAll()
  return res.json({
    status: 'ok',
    data: aspirants
  })
});

/** GET aspirant/:aspirant_id 
 * Execute a search for the given aspirant_id
 * response's body:
 * - when user is found:
 * {
 *  status: 'ok',
 *  data: aspirant
 * }
 * - when user isn't:
 * {
 *  status: 'not found',
 *  data: null
 * }
*/
router.get('/aspirants/:aspirant_id', async (req, res, next) => {
  const aspirant = await getAspirantById(req.params.aspirant_id)
  const status = (aspirant) ? 'ok' : 'not_found';
  return res.json({
    status: status,
    data: aspirant
  })
});

/** POST aspirants. 
 * Try to create a new aspirant.
 * request's body:
 * {
 *  storeKeeperId: <aspirant's storeekeeper id>,
 *  email: <aspirant's email>
 * }
 * response's body:
 * - If it was possible to create:
 * {
 *  status: 'ok',
 *  data: newAspirantCreated
 * }
 * - If the aspirant is already registerd:
 * {
 *  status: 'duplicate',
 *  data: null
 * }
 * 
*/
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
