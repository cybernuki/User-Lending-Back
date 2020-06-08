const { Investors } = require('../database')


/** - searchInvestor
 * This function search for a investor by its email
 * @param {*} investorEmail is the investor's email
 * 
 * @returns found investor or null;
 */
const searchInvestor = async (investorEmail) => {
  const investor = await Investors.findOne({
    where: {
      email: investorEmail
    }
  })
  return investor;
}

/** -updateInversion
 * This function update the amount of a investor has done.
 * @param {*} email is the email of the investor
 * @param {*} amount is the new amount that will be added
 * 
 * @returns: {result: 'updated'} if it was possible to updated
 * or {result: 'error_to_update'} if it wasn't possible to update
 */
const updateInversion = async (email, amount) => {
  try {
    const result = await Investors.increment('amount',
      {
        by: amount,
        where: {
          email: email
        }
      });
    return { result: 'updated' };
  } catch (error) {
    console.log("Error to update investor");
    return { result: 'error_to_update' };
  }
};

/** -createInvestor
 * This function creates a new investor into the database
 * @param {*} email is the email of the investor
 * @param {*} amount is the amount that will be added
 * 
 * @returns: {result: 'created', data: investor} if it was possible to create
 * or {result: 'error_to_create'} if it wasn't possible to create
 */
const createInvestor = async (email, amount) => {
  try {
    const investor = await Investors.create({
      email: email,
      amount: amount
    });
    return { result: 'created', data: investor };
  } catch (error) {
    console.log(error);
    return { result: 'error_to_create' };
  }
}

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
const registInvestor = async (data) => {
  let investor = null;

  if (isNaN(data.amount)) return { status: 'error', message: 'Amount is not a number' };
  if (data.amount < 20000) return { status: 'error', message: 'Amount is under 20.000 COP' };

  investor = await searchInvestor(data.email);

  if (investor) {
    //Update investor
    return await updateInversion(data.email, data.amount);
  } else {
    // create a new investor
    return await createInvestor(data.email, data.amount);
  }
};

module.exports = { registInvestor, searchInvestor };