const { getGathering, updateAmount: updateFunds, finishFund } = require('./lib.funds');
const { search: searchPiece, create: createPiece, updateAmount: updatePiece } = require('./lib.pieces');
const investorsLib = {};

investorsLib.FUND_LIMIT = 3500000;

investorsLib.putMoney = async (investors_email, amount) => {

  if (isNaN(amount) || amount < 0) return null;

  let result = { remain: amount, pieces: [] };

  let gathering = await getGathering();
  if (!gathering) return result;
  result.remain = ((gathering.amount + amount) > investorsLib.FUND_LIMIT) ? (gathering.amount + amount) - 3500000 : 0;
  let acceptedAmount = amount - result.remain;
  await updateFunds(gathering.id, acceptedAmount);

  let piece = await searchPiece(investors_email, gathering.id);

  if (!piece) {
    piece = await createPiece(investors_email, acceptedAmount, gathering.id);
  }
  else {
    await updatePiece(investors_email, gathering.id, acceptedAmount);
  }

  result.pieces.push(await searchPiece(investors_email, gathering.id));

  if ((gathering.amount + acceptedAmount) === investorsLib.FUND_LIMIT) await finishFund(gathering.id);

  if (!result.remain) return result;

  let call = await investorsLib.putMoney(investors_email, result.remain);
  result.remain = call.remain;
  result.pieces.concat(call.pieces);

  return result;
};

module.exports = investorsLib;