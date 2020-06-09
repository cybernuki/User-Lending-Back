var express = require('express');
var router = express.Router();
const { registInvestor, searchInvestor } = require('../controllers/controller.Investors');

/** POST aspirants. 
 * Creates or update an inversor
 * 
*/
router.post('/investors', async (req, res, next) => {
  const data = req.body
  if (!data.email || !data.amount) return res.status(400).json({ 'message': 'Bad body' });

  //registInvestor
  const result = await registInvestor(data);
  return res.send(result);
});

router.get('/investors/:user_email', async (req, res, next) => {
  const investor = await searchInvestor(req.params.user_email);
  if (!investor) return res.json({ status: 'not_found' });
  return res.send(investor);
})
module.exports = router;
