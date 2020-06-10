const axios = require('axios');
const { BASE_URL } = require('./config');

let aspirant = null

describe('GET@/aspirant/:aspirant_id', () => {
  beforeEach(async () => {
    const EMAIL =
      'dely.dely@rappi.com';
    const PASSWORD = '123456'
    let response = await axios.post(`${BASE_URL}/aspirants`, {
      email: EMAIL,
      password: PASSWORD
    });
    aspirant = response.data
  });

  it('Execute a search for the given aspirant_id', async () => {
    let id = aspirant.data.storeKeeperId
    let response = await axios.get(`${BASE_URL}/aspirants/${id}`)
    id = response.data.data.storeKeeperId
    expect(id).toEqual("111254");
  })

});