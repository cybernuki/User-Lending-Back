const { Pieces } = require('../models');

const piecesLib = { name: 'piecesLib' };

/**
 * create - creates and save a new instance of a piece
 * @param {String} investor_email - is the investor's email
 * @param {float} amount  - is the given amount
 * @param {String} fund_id  - is the corresponding fund
 * @returns {Model} the new Piece or null if there was an error
 */
piecesLib.create = async (investor_email, amount, fund_id) => {
  try {
    if (amount < 0) return null;
    let piece = await piecesLib.search(investor_email, fund_id);
    if (piece) return piece;
    return await Pieces.create({
      investor_email,
      amount,
      fund_id
    })
  } catch (error) {
    //console.log(error);
    return null;
  }
};

/**
 * search - search a piece by the investor id and fund id
 * @param {String} investor_email 
 * @param {String} fund_id 
 */
piecesLib.search = async (investor_email, fund_id) => {
  try {
    return await Pieces.findOne({
      attributes: ['id', 'amount', 'investor_email', 'fund_id', 'createdAt'],
      where: {
        investor_email,
        fund_id
      }
    })
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * updateAmount - Increase the piece's amount
 * @param {String} investor_email 
 * @param {String} fund_id 
 */
piecesLib.updateAmount = async (investor_email, fund_id, amount) => {
  try {
    await Pieces.increment({ amount: amount }, { where: { investor_email, fund_id } })
  } catch (error) {
    //console.error(error);
    return null;
  }
}

module.exports = piecesLib;