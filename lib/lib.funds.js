const { Funds } = require('../models'),
  { FUNDS_STATUTS } = Funds;

const fundsLib = { name: 'fundsLib' };

/**
 * create - creates a new fund
 * @param {string} aspirantId 
 * @param {string} status_ 
 */
fundsLib.create = async (aspirantId, status_ = null) => {
  try {
    let fund = await fundsLib.search(aspirantId);

    if (fund) return fund;
    if (!status_) status_ = FUNDS_STATUTS['waiting'];
    else status_ = FUNDS_STATUTS[status_] || FUNDS_STATUTS['waiting'];

    fund = await Funds.create({
      aspirant_id: aspirantId,
      status: status_,
    });
    return fund;
  } catch (error) {
    //console.log(error);
    return null
  }
};

/**
 * getGathering - search a fund with the status 'gathering funds'
 */
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

/**
 * Search - search a fund that has the given aspirant_id
 * @param {string} aspirant_id 
 */
fundsLib.search = async (aspirant_id) => {
  try {
    return await Funds.findOne({
      attributes: ['id', 'amount', 'status', 'createdAt', 'aspirant_id'],
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
 * getNextWaiting - Returning the oldest waiting by searching in ascending order
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
 * getAvailableFund - done with the given fund changin its status to done
 * and search the next waiting fund to drive into the new gathering fund
 * @param {int} fund_id - fund id
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
    await Funds.update({ status: FUNDS_STATUTS[newStatus] }, { where: { id: fund_id } })
  } catch (error) {
    console.error(error)
    return null;
  }
}

/**
 * updateAmount - increase the fund's amount with the new amount
 * @param {int} fund_id - fund id
 * @param {float} newFund - new valor
 */
fundsLib.updateAmount = async (fund_id, newFund) => {
  try {
    await Funds.increment({ amount: newFund }, { where: { id: fund_id } })
  } catch (error) {
    console.error(error)
  }
}

module.exports = fundsLib;