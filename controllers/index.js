const aspirantsController = require('./controller.Aspirants');
const investorsController = require('./controller.Investors');

const generalController = {};

/** AspirantLogin
 * Execute all step required to do an aspirant regist into the system
 * @param {*} email 
 * @param {*} password 
 */
generalController.aspirantLogin = async (data) => {
  const verify = await aspirantsController.verifyEmail(data.email);
  if (verify === 'none') return { status: 'not_courier' };

  const token = await aspirantsController.getToken(data.email, data.password);
  if (!token) return { status: 'invalid_credentials' };

  const id = await aspirantsController.getStoreKeeperId(token);
  if (!id) return { status: 'error_getting_id' };

  data.storeKeeperId = id;
  const aspirant = await aspirantsController.create(data);
  if (!aspirant) return { status: 'duplicated', data: aspirant };

  return { status: 'ok', data: aspirant };
};

/** -registInvestor
 * this function validate data and execute the regist of a new investor
 * 
 * @param {*} data is a json object with the attributes email and amount of the new investor
 * 
 * @returns: the following object: {status: 'created', data: investor} is sent if the creation was success.
 * Otherwise, {status:'error_to_create'} is sent
 * if a regist was previously with the same email, the following object is sent in case of success:
 * {status: 'updated'}. In case of error, {status:'error_to_update'} is sent.
 */
generalController.registInvestor = async (data) => {
  let investor = null;

  if (isNaN(data.amount)) return { status: 'error', message: 'Amount is not a number' };
  if (data.amount < 20000) return { status: 'error', message: 'Amount is under 20.000 COP' };

  investor = await investorsController.search(data.email);

  if (investor) {
    //Update investor
    return await investorsController.update(data.email, data.amount);
  } else {
    // create a new investor
    return await investorsController.create(data.email, data.amount);
  }
};

module.exports = generalController;