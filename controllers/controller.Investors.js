const models = require('../models');

const investorsController = {};

/** - search
 * This function search for a investor by its email
 * @param {*} investorEmail is the investor's email
 * 
 * @returns found investor or null;
 */
investorsController.search = async (investorEmail) => {
  const investor = await models.Investors.findOne({
    where: {
      email: investorEmail
    }
  })
  return investor;
}

/** -update
 * This function update the amount of a investor has done.
 * @param {*} email is the email of the investor
 * @param {*} amount is the new amount that will be added
 * 
 * @returns: {result: 'updated'} if it was possible to updated
 * or {result: 'error_to_update'} if it wasn't possible to update
 */
investorsController.update = async (email, amount) => {
  try {
    const result = await models.Investors.increment('amount',
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

/** -create
 * This function creates a new investor into the database
 * @param {*} email is the email of the investor
 * @param {*} amount is the amount that will be added
 * 
 * @returns: {result: 'created', data: investor} if it was possible to create
 * or {result: 'error_to_create'} if it wasn't possible to create
 */
investorsController.create = async (email, amount) => {
  try {
    const investor = await models.Investors.create({
      email: email,
      amount: amount
    });
    return { result: 'created', data: investor };
  } catch (error) {
    console.log(error);
    return { result: 'error_to_create' };
  }
}


module.exports = investorsController;