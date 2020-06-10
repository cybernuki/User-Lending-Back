const axios = require('axios');
const { BASE_URL } = require('./config');

describe('GET@/aspirants', () => {
  it('This route returns all aspirants saved in the db with status 200', async () => {
    const result = await axios.get(
      `${BASE_URL}/aspirants`
    );
    expect(result.status).toEqual(200);
  })
})