const { Funds } = require('../models'),
  { FUNDS_STATUTS } = Funds;

const fundsLib = {};

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
    console.error(error);
    return null;
  };
};

fundsLib.search = async (aspirant_id) => {
  try {
    return await Funds.findOne({
      where: {
        aspirant_id: aspirant_id
      }
    })
  } catch (error) {
    console.error(error);
  }
};
module.exports = fundsLib;