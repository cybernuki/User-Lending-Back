const axios = require('axios');
const { BASE_URL } = require('./config');

describe('POST@/investors', () => {
  it('creates the amount of an inverter', async () => {
    const EMAIL =
      'test@rappi.com';
    const AMOUNT = '20000'
    let response = await axios.post(`${BASE_URL}/investors`, {
      email: EMAIL,
      amount: AMOUNT
    });
    expect(response.status).toEqual(200);
    let investors = response.data
    expect(investors).toEqual({
      result: 'created',
      data: { email: 'test@rappi.com', amount: '20000' }
    })
  })
})