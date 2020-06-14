const fundPool = require('./lib/fundPool');
const fundLib = require('./lib/lib.funds');
const { Funds } = require('./models'),
  { FUNDS_STATUTS } = Funds;
const models = require('./models');

let ASPIRANEMAIL = 'toipopocho@gmail.com'
let ASPIRANDID1 = 'soy_unRT';

let ASPIRANEMAIL2 = 'toipopocho1@gmail.com'
let ASPIRANDID2 = 'voy_segundis';

let ASPIRANEMAIL3 = 'toipopocho2@gmail.com'
let ASPIRANDID3 = 'nah_tercero';

let ASPIRANEMAIL4 = 'toipopocho3@gmail.com'
let ASPIRANDID4 = 'cuarto_sad';

(async () => {
  await models.sequelize.sync({ force: true });

  console.log("END SYNC-----------------------------------");

  //A previous found with gathering 

  await models.Aspirants.create({
    storeKeeperId: ASPIRANDID1,
    email: ASPIRANEMAIL
  })
  await models.Aspirants.create({
    storeKeeperId: ASPIRANDID2,
    email: ASPIRANEMAIL2
  })
  await models.Aspirants.create({
    storeKeeperId: ASPIRANDID3,
    email: ASPIRANEMAIL3
  })
  await models.Aspirants.create({
    storeKeeperId: ASPIRANDID4,
    email: ASPIRANEMAIL4
  })


  const fund1 = await fundPool.addFund(ASPIRANDID1);
  // console.log(fund1.dataValues);

  const fund2 = await fundPool.addFund(ASPIRANDID2);
  // console.log(fund2.dataValues);

  const fund3 = await fundPool.addFund(ASPIRANDID3);
  // console.log(fund3.dataValues);

  const fund4 = await fundPool.addFund(ASPIRANDID4);
  // console.log(fund4.dataValues);

  let gathering = await fundLib.getGathering();
  console.log(gathering.dataValues);

  let Availabe = await fundLib.getNextWaiting();
  console.log(Availabe.dataValues);

  // Finish gathering
  await fundLib.finishFund(gathering.dataValues.id);

  gathering = await fundLib.getGathering();
  console.log(gathering.dataValues);

  Availabe = await fundLib.getNextWaiting();
  console.log(Availabe.dataValues);

  // Finish gathering
  await fundLib.finishFund(gathering.dataValues.id);

  gathering = await fundLib.getGathering();
  console.log(gathering.dataValues);

  Availabe = await fundLib.getNextWaiting();
  console.log(Availabe.dataValues);

  // Finish gathering
  await fundLib.finishFund(gathering.dataValues.id);

  gathering = await fundLib.getGathering();
  console.log(gathering.dataValues);
  Availabe = await fundLib.getNextWaiting();
  console.log(!Availabe);

  // Finish gathering
  await fundLib.finishFund(gathering.dataValues.id);

  gathering = await fundLib.getGathering();
  console.log(!gathering);
  Availabe = await fundLib.getNextWaiting();
  console.log(!Availabe);


  // Availabe = await fundLib.getNextWaiting();
  // console.log(Availabe.dataValues);

  // await Availabe.update({ status: FUNDS_STATUTS['gathering'] });
  // console.log(Availabe.dataValues);

  // Availabe = await fundLib.getNextWaiting();
  // console.log(Availabe.dataValues);

  models.sequelize.close();
})();