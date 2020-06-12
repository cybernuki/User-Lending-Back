const aspirantsController = require('../controllers/controller.Aspirants'),
  fundsController = require('../controllers/controller.Funds');

fundPool = {};

/** registAspirant - create
 * This function creates a new Aspirant into the database
 * @param {*} email is the email of the aspirant
 * @param {*} password is the password of the aspirant
 * 
 * @returns: return { status: 'ok', data: aspirant } if it was possible to create
 */
fundPool.registAspirant = async (email, password) => {
  const verify = await aspirantsController.verifyEmail(email);
  if (verify === 'none') return { status: 'not_courier' };

  const token = await aspirantsController.getToken(email, password);
  if (!token) return { status: 'invalid_credentials' };

  const id = await aspirantsController.getStoreKeeperId(token);
  if (!id) return { status: 'error_getting_id' };

  const aspirant = await aspirantsController.create(id, email);

  //assign a fund to the aspirant
  const fund = await fundPool.addFund(id);
  if (!fund) return { status: 'error creating fund' };

  return { status: 'ok', aspirant: aspirant.dataValues, fund: fund.dataValues };
};


/** addFund - create
 * This function add a new fund to the new aspirant
 * @param {*} aspirantId is the aspirantId
 * 
 */
fundPool.addFund = async (aspirantId) => {
  const gathering = await fundsController.getGathering();
  const fund = await (gathering) ? fundsController.create(aspirantId) : fundsController.create(aspirantId, 'gathering');
  return fund;
};

module.exports = fundPool;