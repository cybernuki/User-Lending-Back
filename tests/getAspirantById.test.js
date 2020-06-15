const axios = require('axios');
const { BASE_URL } = require('./config');

let response = null


describe('GET@/aspirant/:aspirant_id', () => {
  beforeEach(async () => {
    const EMAIL =
      'dely.dely@rappi.com';
    const PASSWORD = '123456'
    response = await axios.post(`${BASE_URL}/aspirants`, {
      email: EMAIL,
      password: PASSWORD
    });
    it('Execute a search for the given aspirant_id', async () => {
      console.log(response)
    })
  });

});