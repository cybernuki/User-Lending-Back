const { Funds } = require('../models'),
  { FUNDS_STATUTS } = Funds;

const fundsLib = { name: 'fundsLib' };

/**
 * 
 */
fundsLib.create = async (aspirantId, status_ = null) => {
  try {
    if (!status_) status_ = FUNDS_STATUTS['waiting'];
    else status_ = FUNDS_STATUTS[status_] || FUNDS_STATUTS['waiting'];

    const fund = await Funds.create({
      aspirant_id: aspirantId,
      status: status_,
    });
    return fund;
  } catch (error) {
    // console.log(error);
    return await fundsLib.search(aspirantId);
  }
};

fundsLib.getGathering = async () => {
  try {
    return await Funds.findOne({
      where: {
        status: FUNDS_STATUTS['gathering']
      }
    })
  } catch (error) {
    //console.error(error);
    return null;
  };
};

fundsLib.search = async (aspirant_id) => {
  try {
    return await Funds.findOne({
      attributes: ['id', 'amount', 'status', 'createdAt'],
      where: {
        aspirant_id: aspirant_id
      }
    })
  } catch (error) {
    //console.error(error);
    return null;
  }
};


/**
 * getNextWaiting - Returning the oldest waiting in ascending order
 */
fundsLib.getNextWaiting = async () => {
  try {
    return await Funds.findOne({
      order: [['createdAt', 'ASC']],
      where: {
        status: FUNDS_STATUTS['waiting']
      },
      attributes: ['id', 'amount', 'status', 'aspirant_id']
    })
  } catch (error) {
    console.error(error)
  }
};

/**
 * getAvailableFund - Find a fund, return the oldest otherwise return null
 */
fundsLib.finishFund = async (fund_id) => {
  //Change status from gathering fund to done
  await fundsLib.changeStatus(fund_id, 'done');
  //change next waiting fund to gathering status
  let next = await fundsLib.getNextWaiting();
  if (next) await fundsLib.changeStatus(next.dataValues.id, 'gathering');
};

/**
 * changeStatus - search by fund_id and change the status
 * @param {int} fund_id - fund id
 * @param {string} newStatus - new status
 */
fundsLib.changeStatus = async (fund_id, newStatus) => {
  if (!FUNDS_STATUTS[newStatus]) throw new Error("bad fund status key");
  try {
    return await Funds.update({ status: FUNDS_STATUTS[newStatus] }, { where: { id: fund_id } })
  } catch (error) {
    console.error(error)
    return null;
  }
}

module.exports = fundsLib;