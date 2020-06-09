const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('bvoqkfkyktqwe5sxkgpy', 'ugveypdjqgy46afa', 'DqE8RK3h6HYDRcYpBqzi', {
  host: 'bvoqkfkyktqwe5sxkgpy-mysql.services.clever-cloud.com',
  dialect: 'mysql'
});

const Aspirants = sequelize.import('./models/aspirants');
const Investors = sequelize.import('./models/investors');
const Funds = sequelize.import('./models/funds');

Funds.belongsTo(Aspirants, { foreignKey: 'storeKeeperId', as: 'aspirantId' });

module.exports = { Aspirants, Investors, Funds };