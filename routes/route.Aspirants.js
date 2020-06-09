const express = require('express');
const router = express.Router();
const aspirantsUtilities = require('../controllers/controller.Aspirants'),
  generalController = require('../controllers');

/** GET aspirants. 
 * This route returns all aspirants saved in the db
 * response's body:
 * {
 *  status: 'ok',
 *  data: [aspirants]
 * }
*/
router.get('/aspirants', async (req, res, next) => {
  const aspirants = await aspirantsUtilities.getAll()
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
 *  status: 'not_found',
 *  data: null
 * }
*/
router.get('/aspirants/:aspirant_id', async (req, res, next) => {
  const aspirant = await aspirantsUtilities.search(req.params.aspirant_id)
  const status = (aspirant) ? 'ok' : 'not_found';
  return res.json({
    status: status,
    data: aspirant
  })
});

/** POST aspirants. 
 * This endpoint login an aspirant to the database.
 * the response body has the possible status:
 * 
 * - When given email is not linked to any rappitendero:
 * { status: 'not_courier' }
 * 
 * - When given email is linked to a rappitendero but password is wrong:
 * { status: 'invalid_credentials' }
 * 
 * - When aspirant is already register in our database:
 * { status: 'duplicated' }
 * 
 * - When everything done correctly:
 * { status: 'ok' }
 * 
 * - When somenthing went wrong trying to get the storekeeper id:
 * { status: 'error_getting_id'}
*/
router.post('/aspirants', async (req, res, next) => {
  data = req.body;
  console.log(data);

  if (!data.email || !data.password) return res.status(400).json({ 'message': 'Bad body' });

  let login = await generalController.aspirantLogin(data);

  return res.send(login)
});

module.exports = router;
