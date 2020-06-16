const models = require('../models');

const fundsController = {};

/**
 * 
 */
fundsController.create = async (aspirantId, status_ = null) => {
  try {
    if (!status_) status_ = models.Funds.FUNDS_STATUTS['waiting'];
    else status_ = models.Funds.FUNDS_STATUTS[status_] || models.Funds.FUNDS_STATUTS['waiting'];


    const fund = await models.Funds.create({
      aspirant_id: aspirantId,
      status: status_,
    });
    return fund;
  } catch (error) {
    // console.log(error);
    return await fundsController.search(aspirantId);
  }
};

fundsController.getGathering = async () => {
  try {
    return await models.Funds.findOne({
      where: {
        status: models.Funds.FUNDS_STATUTS['gathering']
      }
    })
  } catch (error) {
    console.error(error);
    return null;
  };
};

fundsController.search = async (aspirant_id) => {
  try {
    return await models.Funds.findOne({
      where: {
        aspirant_id: aspirant_id
      }
    })
  } catch (error) {
    console.error(error);
  }
};
module.exports = fundsController;