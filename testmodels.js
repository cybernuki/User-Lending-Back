
const models = require('./models');

let AMOUNT = 20000
let ASPIRANEMAIL = 'toipopocho@gmail.com'
let ASPIRANDID = 'soy_unRT'
let INVESTOREMAIL = 'investor@gmail.com';

(async () => {
  //Entra un pinshi usuario
  await models.sequelize.sync({ force: true })

  const aspirant = await models.Aspirants.create({
    storeKeeperId: ASPIRANDID,
    email: ASPIRANEMAIL
  })
  console.log('aspirant done');


  //Se le asigna un fund
  const fund = await models.Funds.create({
    aspirant_id: aspirant.dataValues.storeKeeperId,
    status: models.Funds.FUNDS_STATUTS['gathering'],
  });
  console.log('fund done');

  // hay un fund esperando?:
  gatherFund = await models.Funds.findOne()

  const piece = await models.Pieces.create({
    amount: AMOUNT,
    fund_id: fund.dataValues.id,
    investor_email: INVESTOREMAIL// Pieces.investors_id
  })
  console.log('piece done');


  console.log('ALL done');
})()
