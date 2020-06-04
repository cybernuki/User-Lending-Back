const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('bvoqkfkyktqwe5sxkgpy', 'ugveypdjqgy46afa', 'DqE8RK3h6HYDRcYpBqzi', {
  host: 'bvoqkfkyktqwe5sxkgpy-mysql.services.clever-cloud.com',
  dialect: 'mysql'
});

const aspirants = sequelize.import('./models/aspirants');
const investors = sequelize.import('./models/investors');


module.exports = { aspirants, investors };