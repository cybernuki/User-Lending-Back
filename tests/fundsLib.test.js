const { sequelize, Aspirants } = require('../models');
const { create, search, updateAmount, changeStatus, getNextWaiting, getGathering, finishFund } = require('../lib/lib.funds');

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
    expect(fund.status).toEqual('waiting');
    expect(fund.aspirant_id).toEqual('aspirant1');

    fund = await search('aspirant2');

    expect(fund).toBeTruthy();
    expect(fund.status).toEqual('gathering funds');
    expect(fund.aspirant_id).toEqual('aspirant2');

    fund = await search('aspirant3');

    expect(fund).toBeTruthy();
    expect(fund.status).toEqual('done');
    expect(fund.aspirant_id).toEqual('aspirant3');

    fund = await search('aspirant4');

    expect(fund).toBeTruthy();
    expect(fund.status).toEqual('waiting');
    expect(fund.aspirant_id).toEqual('aspirant4');
  } catch (error) {
    fail(error);
  }
}

const searchBad = async () => {
  try {
    let fund = await search('bad id');
    expect(fund).toBeFalsy();
  } catch (error) {
    fail(error);
  }
}

const updateGood = async () => {
  try {
    let fund = await search('aspirant1');
    await updateAmount(fund.id, 20000);
    let fund_1 = await search('aspirant1');

    expect(fund_1).toBeTruthy();
    expect(fund_1.amount).toEqual(fund.amount + 20000);
  } catch (error) {
    fail(error);
  }
}

const changeStatusGood = async () => {
  try {
    let fund1 = await search('aspirant1');
    let fund2 = await search('aspirant2');
    let fund3 = await search('aspirant3');
    let fund4 = await search('aspirant4');

    let change = await changeStatus(fund1.id, 'gathering');
    fund1 = await search('aspirant1');

    expect(change).toBeTruthy();
    expect(fund1.status).toEqual('gathering funds');

    change = await changeStatus(fund2.id, 'waiting');
    fund2 = await search('aspirant2');

    expect(change).toBeTruthy();
    expect(fund2.status).toEqual('waiting');

    change = await changeStatus(fund3.id, 'waiting');
    fund3 = await search('aspirant3');

    expect(change).toBeTruthy();
    expect(fund3.status).toEqual('waiting');

    change = await changeStatus(fund4.id, 'done');
    fund4 = await search('aspirant4');

    expect(change).toBeTruthy();
    expect(fund4.status).toEqual('done');

  } catch (error) {
    fail(error);
  };
};
const changeStatusBad = async () => {
  try {
    let fund = await search('aspirant4');

    await changeStatus(fund.id, "not an status");
    let fund1 = await search('aspirant4');
    expect(fund.id).toEqual(fund1.id);
    expect(fund.amount).toEqual(fund1.amount);
    expect(fund.status).toEqual(fund1.status);
  } catch (error) {
    fail(error);
  };
};

const nextWaitingGood = async () => {
  try {
    let fund3 = await search('aspirant3');
    let fund2 = await search('aspirant2');
    let next = await getNextWaiting();

    expect(next.id === fund3.id || next.id === fund2.id).toBeTruthy();
  } catch (error) {
    fail(error);
  };
};

const finishFundGood = async () => {
  try {
    let changedFund = null;
    let next = await getNextWaiting();
    let gathering = await getGathering();


    //Finish a waiting fund returns false and don't change anything
    failed = await finishFund(next.id);
    expect(failed).toBeFalsy();

    //Finish aspirant1 fund
    await finishFund(gathering.id);
    changedFund = await search(gathering.aspirant_id);
    expect(changedFund.status).toEqual('done');
    //get new gathering and compare with the previous next, both most be the same
    //At this point aspirant 2 or 3 is the new gathering
    gathering = await getGathering();
    expect(next.id === gathering.id).toBeTruthy();
    next = await getNextWaiting();

    //Finish aspirant 2 o 3 fund
    await finishFund(gathering.id);
    changedFund = await search(gathering.aspirant_id);
    expect(changedFund.status).toEqual('done');
    //get new gathering and compare with the previous next, both most be the same
    //At this point there are just one fund in waiting
    gathering = await getGathering();
    expect(next.id === gathering.id).toBeTruthy();
    next = await getNextWaiting();

    //Finish remain aspirant's fund
    await finishFund(gathering.id);
    changedFund = await search(gathering.aspirant_id);
    expect(changedFund.status).toEqual('done');
    //get new gathering and compare with the previous next, both most be the same
    //At this point there are waiting funds no longer
    gathering = await getGathering();
    expect(next).toBeFalsy();

    //Finish a done fund returns a false and don't change anything
    failed = await finishFund(changedFund.id);
    expect(failed).toBeFalsy();
  } catch (error) {
    fail(error);
  }
}

describe('Testing fundsLib functionalities', () => {
  it('checking implemented create function', () => expect(create).toBeTruthy());
  it('Creating a piece with correct information', createGood);
  it('Creating a pice with incorrect information', createBad);
  it('checking implemented  search function', () => expect(search).toBeTruthy());
  it('searching a piece with correct information', searchGood);
  it('searching a piece with incorrect information', searchBad);
  it('checking implemented  updateAmount function', () => expect(updateAmount).toBeTruthy());
  it('update a piece with correct information', updateGood);
  it('checking implemented changeStatus function', () => expect(changeStatus).toBeTruthy());
  it('changing status to a fund with correct information', changeStatusGood);
  it('changing status to a fund with incorrect information', changeStatusBad);
  it('checking implemented getNextWaiting function', () => expect(getNextWaiting).toBeTruthy());
  it('geting next waiting fund ', nextWaitingGood);
  it('checking implemented getNextWaiting function', () => expect(finishFund).toBeTruthy());
  it('geting next waiting fund ', finishFundGood);
});
