const models = require('../models')
const axios = require('axios').default

const aspirantsController = {};

//--------------------------------------------------------------------
// ------------------------Aspirants Utilities------------------------
//--------------------------------------------------------------------
// get all aspirant
aspirantsController.getAll = async () => {
  const aspirants = await models.Aspirants.findAll({})
  return aspirants
}

// get by id
aspirantsController.search = async (aspirantId) => {
  const aspirants = await models.Aspirants.findOne({
    where: {
      storeKeeperId: aspirantId
    }
  })
  return aspirants
}


// Register new aspirant
aspirantsController.create = async (data) => {
  try {
    const aspirants = await models.Aspirants.create({
      storeKeeperId: data.storeKeeperId,
      email: data.email
    })
    return aspirants
  } catch (error) {

    if (error.errors[0].type == 'unique violation') return aspirantsController.search(data.storeKeeperId)
    console.error(error);
  }
}

/**
 * Verify if a given email is a courier
 * 
 * returns 'none' if it is not a courier, and 'courier' in otherwise.
 */
aspirantsController.verifyEmail = async (email) => {
  try {
    const response = await axios.get(`http://microservices.dev.rappi.com/api/rt-auth-helper/user/type?email=${email}`);
    return response.data.user_type;
  } catch (error) {
    console.log(error);
  }
};

/**
 * getAspirantToken get the aspirant token
 * @param {*} email 
 * @param {*} password 
 * 
 * return undefine if it was not possible to get the token, otherwise, returns the token.
 */
aspirantsController.getToken = async (email, password) => {
  const data = {
    'client_id': '74HzD01JbhZ44iE1kh7Gt6dfNjEKrtWiz0FqTUDQ',
    'client_secret': 'W8dOKF1mdHaG9wBNyoOCEBgHajO66GEl81lTDu2P',
    'username': email,
    'password': password,
    'scope': 'all'
  }
  const options = {
    'method': 'POST',
    'headers': {
      'uuid': '550e8400-e29b-41d4-a716-4466554400001234567',
      'platform': 2,
      'Content-Type': 'application/json'
    }
  }

  try {
    const response = await axios.post('http://microservices.dev.rappi.com/api/login/storekeeper', data, options);
    return response.data.access_token;
  } catch (error) {
    //console.log(error);
  }
};


/**
 * 
 * @param {*} token 
 */
aspirantsController.getStoreKeeperId = async (token) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }
  try {
    const response = await axios.get('http://microservices.dev.rappi.com/api/storekeepers-ms/storekeeper/rappitendero/profile?cache=false', options)
    return response.data.id;
  } catch (error) {
    //console.log(error);
  }
}


module.exports = aspirantsController;