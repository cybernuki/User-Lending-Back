const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('bvoqkfkyktqwe5sxkgpy', 'ugveypdjqgy46afa', 'DqE8RK3h6HYDRcYpBqzi', {
  host: 'bvoqkfkyktqwe5sxkgpy-mysql.services.clever-cloud.com',
  dialect: 'mysql'
});

//const CurrencyShop = sequelize.import('models/CurrencyShop');
sequelize.import('models/aspirants');
sequelize.import('models/investors');

// Verify if the arguments when execute the node command have --force or -f
const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force })
  .then(async () => {
    console.log('Database synced');
    sequelize.close();
  })
  .catch(console.error);