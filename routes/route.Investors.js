var express = require('express');
var router = express.Router();
const { registInvestor } = require('../controllers/controller.Investors');
/** POST aspirants. 
 * Creates or update an inversor
 * 
*/
router.post('/investors', registInvestor);

module.exports = router;
