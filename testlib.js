const fundPool = require('./lib/fundPool');
const models = require('./models');

const EMAIL = 'dely.dely@rappi.com';
const PASSWORD = '123456';
let ASPIRANEMAIL = 'toipopocho@gmail.com'
let ASPIRANDID = 'soy_unRT';

(async () => {
  await models.sequelize.sync({ force: true });

  console.log("END SYNC-----------------------------------");

  //A previous found with gathering 

  const aspirant = await models.Aspirants.create({
    storeKeeperId: ASPIRANDID,
    email: ASPIRANEMAIL
  })
  console.log('aspirant done');

  const fund = await models.Funds.create({
    aspirant_id: aspirant.dataValues.storeKeeperId,
    status: models.Funds.FUNDS_STATUTS['gathering'],
  });
  console.log('fund done');

  //Create a rappi user
  let result = await fundPool.registAspirant(EMAIL, PASSWORD);
  console.log('create rappi user with correct credentials and non duplicate:\n');
  console.log(result)
  console.log('\n--------------------------\n');

  //Create a non rappi user
  result = await fundPool.registAspirant(`${EMAIL}123`, PASSWORD);
  console.log(`create rappi user with non correct email:\n`);
  console.log(result)
  console.log('\n--------------------------\n');

  //Create an aspirant with correct email but bad password
  result = await fundPool.registAspirant(EMAIL, `${PASSWORD}123`);
  console.log(`create rappi user with non correct password:\n`);
  console.log(result)
  console.log('\n--------------------------\n');

  //Create an aspirant duplicate
  result = await fundPool.registAspirant(EMAIL, PASSWORD);
  console.log(`create rappi user duplicated:\n`);
  console.log(result)
  console.log('\n--------------------------\n');

})();