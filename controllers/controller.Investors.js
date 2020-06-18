const { investorsLib } = require('../lib');
const { putMoney } = investorsLib;

const investorsController = {};

/** -create
 * This function creates a new investor into the database
 * @param {*} email is the email of the investor
 * @param {*} amount is the amount that will be added
 * 
 * @returns: 
 */
investorsController.registInvestor = async (req, res, next) => {
  const data = req.body
  if (!data.email || !data.amount) return res.status(400).json({ 'message': 'Bad body' });

  //registInvestor
  const result = await putMoney(data.email, data.amount);
  return res.send(result);
};

module.exports = investorsController;