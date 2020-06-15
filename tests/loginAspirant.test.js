const axios = require('axios');
const { BASE_URL } = require('./config');

describe('POST@/aspirant/', () => {
  it('login an aspirant to the database response with status 200', async () => {
    const EMAIL =
      'dely.dely@rappi.com';
    const PASSWORD = '123456'
    let response = await axios.post(`${BASE_URL}/aspirants`, {
      email: EMAIL,
      password: PASSWORD
    });
    let res = response.data
    expect(response.status).toEqual(200);
    expect(res).toEqual({
      status: 'ok',
      data: { storeKeeperId: '111254', email: 'dely.dely@rappi.com' }
    })
  })


})
