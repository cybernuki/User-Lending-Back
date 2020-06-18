const { getGathering, create: createFund } = require('./lib.funds');
const { v4: uuidv4 } = require('uuid');
const { verifyEmail, getToken, getStoreKeeperId, create: createAspirant } = require('./lib.aspirants');
fundPool = { name: 'fundPool' };

/** registAspirant - create
 * This function creates a new Aspirant into the database
 * @param {*} email is the email of the aspirant
 * @param {*} password is the password of the aspirant
 * 
 * @returns: return { status: 'ok', data: aspirant } if it was possible to create
 */
fundPool.registAspirant = async (email, password) => {
  const verify = await verifyEmail(email);
  if (verify === 'none') return { status: 'not_courier' };

  const token = await getToken(email, password);
  if (!token) return { status: 'invalid_credentials' };

  //As the getStoreKeeperId's microservice is down.
  //System will add a random id number, but once this services goes up again
  //Revert this ->
  // const id = await getStoreKeeperId(token);
  const id = await uuidv4();
  if (!id) return { status: 'error_getting_id' };

  const aspirant = await createAspirant(id, email);
  if (!aspirant) return { status: 'error_creating_user' };
  //assign a fund to the aspirant
  console.log(aspirant)
  const fund = await fundPool.addFund(aspirant.storeKeeperId);
  if (!fund) return { status: 'error creating fund' };

  return { status: 'ok', aspirant: aspirant.dataValues, fund: fund.dataValues };
};


/** addFund - create
 * This function add a new fund to the new aspirant
 * @param {*} aspirantId is the aspirantId
 * 
 */
fundPool.addFund = async (aspirantId) => {
  const gathering = await getGathering();
  const fund = await (gathering) ? createFund(aspirantId) : createFund(aspirantId, 'gathering');
  return fund;
};

module.exports = fundPool;