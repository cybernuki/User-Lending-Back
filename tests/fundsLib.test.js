const { sequelize, Funds, Aspirants } = require('../models');
const { create, search, updateAmount } = require('../lib/lib.funds');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Aspirants.create({
    storeKeeperId: 'aspirant1',
    email: 'aspirant1@correo.com'
  })
  await Aspirants.create({
    storeKeeperId: 'aspirant2',
    email: 'aspirant2@correo.com'
  })
  await Aspirants.create({
    storeKeeperId: 'aspirant3',
    email: 'aspirant3@correo.com'
  })
  await Aspirants.create({
    storeKeeperId: 'aspirant4',
    email: 'aspirant4@correo.com'
  })
});

afterAll(() => {
  sequelize.close();
})

const createGood = async () => {
  let fund = await create('aspirant1');
  expect(fund).toBeTruthy();
  expect(fund.amount).toEqual(0);
  expect(fund.status).toEqual('waiting');
  expect(fund.aspirant_id).toEqual('aspirant1');

  fund = await create('aspirant2', 'gathering');
  expect(fund).toBeTruthy();
  expect(fund.amount).toEqual(0);
  expect(fund.status).toEqual('gathering funds');
  expect(fund.aspirant_id).toEqual('aspirant2');

  fund = await create('aspirant3', 'done');
  expect(fund).toBeTruthy();
  expect(fund.amount).toEqual(0);
  expect(fund.status).toEqual('done');
  expect(fund.aspirant_id).toEqual('aspirant3');

  fund = await create('aspirant4', 'waiting');
  expect(fund).toBeTruthy();
  expect(fund.amount).toEqual(0);
  expect(fund.status).toEqual('waiting');
  expect(fund.aspirant_id).toEqual('aspirant4');

  fund = await create('aspirant4', 'not status');
  expect(fund).toBeTruthy();
  expect(fund.amount).toEqual(0);
  expect(fund.status).toEqual('waiting');
  expect(fund.aspirant_id).toEqual('aspirant4');
};

const createBad = async () => {
  try {
    let fund = await create('not aspirant', 'waiting');
    expect(fund).toBeFalsy();

  } catch (error) {
    fail(error);
  }
}

const searchGood = async () => {
  try {
    let fund = await search('aspirant1');

    expect(fund).toBeTruthy();
    expect(fund.amount).toEqual(0);
    expect(fund.investor_email).toEqual('aspirant1');

    piece = await search('investor2', fund.id);
    expect(piece).toBeTruthy();
    expect(piece.amount).toEqual(1500000);
    expect(piece.investor_email).toEqual('investor2');
  } catch (error) {
    fail(error);
  }
}

// const searchBad = async () => {
//   try {
//     let piece = await search('investor1', 'bad fund id');
//     expect(piece).toBeFalsy();

//     piece = await search('bad investor email', fund.id);
//     expect(piece).toBeFalsy();
//   } catch (error) {
//     fail(error);
//   }
// }

// const updateGood = async () => {
//   try {
//     let fund = await Funds.findOne({ where: { aspirant_id: 'aspirant1' } });
//     let piece1 = await search('investor1', fund.id);
//     let piece2 = await search('investor2', fund.id);

//     await updateAmount('investor1', fund.id, 20000);
//     let piece1_1 = await search('investor1', fund.id);

//     expect(piece1_1.amount).toEqual(piece1.amount + 20000);
//     expect(piece1_1.investor_email).toEqual(piece1.investor_email);

//     await updateAmount('investor2', fund.id, 20000);
//     let piece2_1 = await search('investor2', fund.id);

//     expect(piece2_1.amount).toEqual(piece2.amount + 20000);
//     expect(piece2_1.investor_email).toEqual(piece2.investor_email);
//   } catch (error) {
//     fail(error);
//   }
// }

// const updateBad = async () => {
//   try {
//     let result = await updateAmount('bad investor email', 'bad fund id', 20000);
//     expect(result).toBeFalsy();

//     result = await updateAmount('investor1', 'bad fund id', 20000);
//     expect(result).toBeFalsy();

//   } catch (error) {
//     fail(error);
//   }
// }

describe('Testing fundsLib functionalities', () => {
  it('checking implemented function', () => expect(create).toBeTruthy());
  it('Creating a piece with correct information', createGood);
  it('Creating a pice with incorrect information', createBad);
  // it('checking implemented function', () => expect(search).toBeTruthy());
  // it('searching a piece with correct information', searchGood);
  // it('searching a piece with incorrect information', searchBad);
  // it('checking implemented function', () => expect(update).toBeTruthy());
  // it('update a piece with correct information', updateGood);
  // it('update a piece with incorrect information', updateBad);
});
