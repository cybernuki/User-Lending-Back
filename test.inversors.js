#!/usr/bin/env node
const { sequelize, Aspirants, Funds, Pieces } = require('./models');
const { putMoney } = require('./lib/lib.investors');
const { search: searchPiece } = require('./lib/lib.pieces');
const { search: searchFund } = require('./lib/lib.funds');


(async () => {
  await sequelize.sync({ force: true });
  await Aspirants.create({
    storeKeeperId: 'aspirant0',
    email: 'aspirant0@correo.com'
  })
  let fund = await Funds.create({
    aspirant_id: 'aspirant0',
    status: Funds.FUNDS_STATUTS['done'],
    amount: 3500000
  });
  //creating new fund
  await Aspirants.create({
    storeKeeperId: 'aspirant1',
    email: 'aspirant1@correo.com'
  })
  fund = await Funds.create({
    aspirant_id: 'aspirant1',
    status: Funds.FUNDS_STATUTS['gathering'],
    amount: 0
  });

  //Executing function and getting new status of the fund
  let result = await putMoney('investor0', 1000000);

  // Save the data of current piece that correspond to investor 0
  let piece = await Pieces.findOne({ where: { investor_email: 'investor0' } });
  fund = await Funds.findOne({ where: { id: piece.fund_id } });
  let previousAmount = fund.amount;
  //Executing function and getting new status of the fund
  result = await putMoney('investor0', 1000000);

  result = await putMoney('investor1', 1520000);
})()