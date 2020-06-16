const { sequelize, Funds, Aspirants } = require('../models');
const { create, search, updateAmount } = require('../lib/lib.pieces');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Aspirants.create({
    storeKeeperId: 'aspirant1',
    email: 'aspirant1@correo.com'
  })
  fund = await Funds.create({
    aspirant_id: 'aspirant1',
    status: Funds.FUNDS_STATUTS['gathering'],
  });
});

afterAll(() => {
  sequelize.close();
})
const createGood = async () => {
  let fund = await Funds.findOne({ where: { aspirant_id: 'aspirant1' } });
  fund = fund.dataValues;
  let piece = await create('investor1', 20000, fund.id);

  expect(piece).toBeTruthy();
  expect(piece.amount).toEqual(20000);
  expect(piece.investor_email).toEqual('investor1');

  piece = await create('investor2', 1500000, fund.id);
  expect(piece).toBeTruthy();
  expect(piece.amount).toEqual(1500000);
  expect(piece.investor_email).toEqual('investor2');
};

const createBad = async () => {
  try {
    let fund = await Funds.findOne({ where: { aspirant_id: 'aspirant1' } });
    let piece = await create('investor1', 20000, 'not A fund ID');
    expect(piece).toBeFalsy();

    piece = await create('investor1', -10000, fund.id);
    expect(piece).toBeFalsy();

  } catch (error) {
    fail(error);
  }
}

const searchGood = async () => {
  try {
    let fund = await Funds.findOne({ where: { aspirant_id: 'aspirant1' } });

    let piece = await search('investor1', fund.id);
    expect(piece).toBeTruthy();
    expect(piece.amount).toEqual(20000);
    expect(piece.investor_email).toEqual('investor1');

    piece = await search('investor2', fund.id);
    expect(piece).toBeTruthy();
    expect(piece.amount).toEqual(1500000);
    expect(piece.investor_email).toEqual('investor2');
  } catch (error) {
    fail(error);
  }
}

const searchBad = async () => {
  try {
    let piece = await search('investor1', 'bad fund id');
    expect(piece).toBeFalsy();

    piece = await search('bad investor email', fund.id);
    expect(piece).toBeFalsy();
  } catch (error) {
    fail(error);
  }
}

const updateGood = async () => {
  try {
    let fund = await Funds.findOne({ where: { aspirant_id: 'aspirant1' } });
    let piece1 = await search('investor1', fund.id);
    let piece2 = await search('investor2', fund.id);

    await updateAmount('investor1', fund.id, 20000);
    let piece1_1 = await search('investor1', fund.id);

    expect(piece1_1.amount).toEqual(piece1.amount + 20000);
    expect(piece1_1.investor_email).toEqual(piece1.investor_email);

    await updateAmount('investor2', fund.id, 20000);
    let piece2_1 = await search('investor2', fund.id);

    expect(piece2_1.amount).toEqual(piece2.amount + 20000);
    expect(piece2_1.investor_email).toEqual(piece2.investor_email);
  } catch (error) {
    fail(error);
  }
}

const updateBad = async () => {
  try {
    let result = await updateAmount('bad investor email', 'bad fund id', 20000);
    expect(result).toBeFalsy();

    result = await updateAmount('investor1', 'bad fund id', 20000);
    expect(result).toBeFalsy();

  } catch (error) {
    fail(error);
  }
}

describe('Testing piecesLib functionalities', () => {
  it('checking implemented function', () => expect(create).toBeTruthy());
  it('Creating a piece with correct information', createGood);
  it('Creating a pice with incorrect information', createBad);
  it('checking implemented function', () => expect(search).toBeTruthy());
  it('searching a piece with correct information', searchGood);
  it('searching a piece with incorrect information', searchBad);
  it('checking implemented function', () => expect(updateAmount).toBeTruthy());
  it('update a piece with correct information', updateGood);
  it('update a piece with incorrect information', updateBad);
});
