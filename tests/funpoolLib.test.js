const axios = require('axios');
const { BASE_URL } = require('./config');
const { fundPool } = require('../lib');
const models = require('../models');

const EMAIL = 'dely.dely@rappi.com';
const PASSWORD = '123456';
let ASPIRANEMAIL = 'toipopocho@gmail.com'
let ASPIRANDID = 'soy_unRT';
let realAspirant = null;

describe('Testing fundPool lib', () => {
  it('You synchronize the database', async () => {
    await models.sequelize.sync({ force: true });
  })
  it('Creating aspirant', async () => {
    realAspirant = await models.Aspirants.create({
      storeKeeperId: ASPIRANDID,
      email: ASPIRANEMAIL
    })
    let data = realAspirant.dataValues

    expect(data).toStrictEqual({ storeKeeperId: 'soy_unRT', email: 'toipopocho@gmail.com' })
  })
  it('Create fund to the aspirant', async () => {
    const fund = await models.Funds.create({
      aspirant_id: realAspirant.dataValues.storeKeeperId,
      status: models.Funds.FUNDS_STATUTS['gathering'],
    });
    expect(fund.amount).toBe(0)
  })
  it('Create a non rappi user', async () => {
    let aspirant = await fundPool.registAspirant(`${EMAIL}123`, PASSWORD);
    expect(aspirant).toStrictEqual({ status: 'not_courier' })
  })
  it('Create an aspirant with correct email but bad password', async () => {
    let aspirant = await fundPool.registAspirant(EMAIL, `${PASSWORD}123`);
    expect(aspirant).toStrictEqual({ status: 'invalid_credentials' })
  })
  it('Create an aspirant duplicate', async () => {
    let fund = await fundPool.registAspirant(EMAIL, PASSWORD);
    let status = fund.status
    expect(status).toBe('ok')
  })
})