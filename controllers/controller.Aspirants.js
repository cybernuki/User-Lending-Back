const { Aspirants } = require('../database')


// get all aspirant
const getAll = async () => {
  const aspirants = await Aspirants.findAll({})
  return aspirants
}

// get by id
const getAspirantById = async (aspirantId) => {
  const aspirants = await Aspirants.findOne({
    where: {
      storeKeeperId: aspirantId
    }
  })
  return aspirants
}


// Register new aspirant
const registerAspirant = async (data) => {
  try {
    const aspirants = await Aspirants.create({
      storeKeeperId: data.storeKeeperId,
      email: data.email
    })
    return aspirants
  } catch (error) {

    if (error.errors[0].type == 'unique violation') return null
    console.error(error);
  }
}


module.exports = { getAll, getAspirantById, registerAspirant }