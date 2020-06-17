const { sequelize, Aspirants, Funds, Pieces } = require('../models');
const { putMoney } = require('../lib/lib.investors');
const { search: searchPiece } = require('../lib/lib.pieces');
const { search: searchFund } = require('../lib/lib.funds');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Aspirants.create({
    storeKeeperId: 'aspirant0',
    email: 'aspirant0@correo.com'
  })
  fund = await Funds.create({
    aspirant_id: 'aspirant0',
    status: Funds.FUNDS_STATUTS['done'],
    amount: 3500000
  });
});

afterAll(() => {
  sequelize.close();
})

const badInputsTc = async () => {
  try {
    let result = await putMoney('investor0', -10000);
    expect(result).toBeFalsy();
    result = await putMoney('investor0', 'asdfasdf');
    expect(result).toBeFalsy();
  } catch (error) {
    fail(error);
  }
};

const emptyFundPoolTc = async () => {
  try {
    let result = await putMoney('investor0', 200000)
    expect(result).toBeTruthy();
    expect(result.remain).toBeTruthy();
    expect(result.pieces).toBeTruthy();

    expect(result.remain).toEqual(200000);
    expect(result.pieces.length).toEqual(0);

  } catch (error) {
    fail(error);
  }
};

const nonEmptyFundPoolTc1 = async () => {
  try {
    //creating new fund
    await Aspirants.create({
      storeKeeperId: 'aspirant1',
      email: 'aspirant1@correo.com'
    })
    let fund = await Funds.create({
      aspirant_id: 'aspirant1',
      status: Funds.FUNDS_STATUTS['gathering'],
      amount: 0
    });

    //Executing function and getting new status of the fund
    let result = await putMoney('investor0', 1000000);
    fund = await searchFund(fund.aspirant_id);

    //verifying that function's resturn exist
    expect(result).toBeTruthy();

    //Verifying attributes values of the function's return
    expect(result.remain).toEqual(0);
    expect(result.pieces.length).toEqual(1);

    //Verifying piece's attributes
    expect(result.pieces[0]).toBeTruthy();
    expect(result.pieces[0].investor_email).toBeTruthy();
    expect(result.pieces[0].investor_email).toEqual('investor0');
    expect(result.pieces[0].fund_id).toBeTruthy();
    expect(result.pieces[0].fund_id).toEqual(fund.id);
    expect(result.pieces[0].amount).toBeTruthy();
    expect(result.pieces[0].amount).toEqual(1000000);

    //Verifying fund's amount has updated witht he entry amount
    expect(fund.amount).toEqual(1000000);

    //verifying piece is saved
    let piece = await searchPiece('investor0', fund.id);
    expect(piece).toBeTruthy();
    expect(piece.id).toEqual(result.pieces[0].id);
  } catch (error) {
    fail(error);
  }
};

const nonEmptyFundPoolTc2 = async () => {
  try {
    // Save the data of current piece that correspond to investor 0
    let piece = await Pieces.findOne({ where: { investor_email: 'investor0' } });
    let fund = await Funds.findOne({ where: { id: piece.fund_id } });
    let previousAmount = fund.amount;
    //Executing function and getting new status of the fund
    let result = await putMoney('investor0', 1000000);

    fund = await Funds.findOne({ where: { id: piece.fund_id } });

    //verifying that function's return exist
    expect(result).toBeTruthy();
    expect(result.pieces).toBeTruthy();

    //Verifying attributes values of the function's return
    // remain must return 0 because it takes all the amount and don't refuse any money
    // pieces still returning just 1 piece because, when a fund has an existent piece with an investor
    // and putMoney is called with that investor, it just update the amount of both, fund and piece
    expect(result.remain).toEqual(0);
    expect(result.pieces.length).toEqual(1);

    //Verifying piece's attributes
    expect(result.pieces[0]).toBeTruthy();
    expect(result.pieces[0].investor_email).toBeTruthy();
    expect(result.pieces[0].investor_email).toEqual('investor0');
    //Verfying that returned piece is the same of the created previously
    expect(result.pieces[0].id).toBeTruthy();
    expect(result.pieces[0].id).toEqual(piece.id);
    //Verifying that the piece amount is updated
    expect(result.pieces[0].amount).toBeTruthy();
    expect(result.pieces[0].amount).toEqual(piece.amount + 1000000);

    //Verifying fund's amount has updated witht he entry amount
    expect(fund.amount).toEqual(previousAmount + 1000000);

    //Finally, verify that a new pieces isn't created
    let allPieces = await Pieces.findAll({});
    expect(allPieces.length).toEqual(1);

  } catch (error) {
    fail(error);
  }
};

const newInvestorTc = async () => {
  try {
    let piece = await Pieces.findOne({ where: { investor_email: 'investor0' } });
    let fund = await Funds.findOne({ where: { id: piece.fund_id } });
    let previousAmount = fund.amount;
    //Executing function and getting new status of the fund
    let result = await putMoney('investor1', 1520000);
    fund = await Funds.findOne({ where: { id: piece.fund_id } });

    //verifying that function's resturn exist
    expect(result).toBeTruthy();
    expect(result.pieces).toBeTruthy();

    //Verifying attributes values of the function's return
    expect(result.remain).toEqual(20000);
    expect(result.pieces.length).toEqual(1);

    //Verifying piece's attributes
    expect(result.pieces[0]).toBeTruthy();
    expect(result.pieces[0].investor_email).toBeTruthy();
    expect(result.pieces[0].investor_email).toEqual('investor1');
    expect(result.pieces[0].fund_id).toBeTruthy();
    expect(result.pieces[0].fund_id).toEqual(fund.id);
    expect(result.pieces[0].amount).toBeTruthy();
    expect(result.pieces[0].amount).toEqual(1500000);

    //Verifying fund's amount has updated witht he entry amount
    expect(fund.amount).toEqual(previousAmount + 1500000);
    //Verifyin fund's status changes to done
    expect(fund.status).toEqual('done');

    //verifying piece is saved
    piece = await searchPiece('investor1', fund.id);
    expect(piece).toBeTruthy();
    expect(piece.id).toEqual(result.pieces[0].id);

    //Finally, verify that a new pieces isn't created
    let allPieces = await Pieces.findAll({});
    expect(allPieces.length).toEqual(2);
  } catch (error) {
    fail(error);
  }
};

const excedingTc1 = async () => {
  try {
    //creating new fund
    await Aspirants.create({
      storeKeeperId: 'aspirant2',
      email: 'aspirant2@correo.com'
    })
    let fund = await Funds.create({
      aspirant_id: 'aspirant2',
      status: Funds.FUNDS_STATUTS['gathering'],
      amount: 0
    });
    //Executing function and getting new status of the fund
    let result1 = await putMoney('investor0', 1000000);
    //Executing function and getting new status of the fund
    let result2 = await putMoney('investor1', 1500000);
    //Executing function and getting new status of the fund
    let result3 = await putMoney('investor2', 1500000);
    //verifying that fund is finished
    fund = await searchFund(fund.aspirant_id);
    expect(fund.amount).toEqual(3500000);
    expect(fund.status).toEqual('done');

    let piece1 = await searchPiece('investor0', fund.id);
    let piece2 = await searchPiece('investor1', fund.id);
    let piece3 = await searchPiece('investor2', fund.id);
    expect(piece1 && piece2 && piece3).toBeTruthy();
    //Verifying correct save of investor0
    expect(piece1.id).toEqual(result1.pieces[0].id);
    expect(piece1.amount).toEqual(1000000);
    //Verifying correct save of investor0 
    expect(piece2.id).toEqual(result2.pieces[0].id);
    expect(piece2.amount).toEqual(1500000);
    //expect that last investor just have a piece with 1'000.000
    expect(piece3.id).toEqual(result3.pieces[0].id);
    expect(piece3.amount).toEqual(1000000);
    expect(result3.remain).toEqual(500000);
  } catch (error) {
    fail(error);
  }
};

const excedingTc2 = async () => {
  try {
    //creating new fund
    await Aspirants.create({
      storeKeeperId: 'aspirant3',
      email: 'aspirant3@correo.com'
    })
    let fund = await Funds.create({
      aspirant_id: 'aspirant3',
      status: Funds.FUNDS_STATUTS['gathering'],
      amount: 0
    });
    //creating new fund
    await Aspirants.create({
      storeKeeperId: 'aspirant4',
      email: 'aspirant4@correo.com'
    })
    let fund2 = await Funds.create({
      aspirant_id: 'aspirant4',
      status: Funds.FUNDS_STATUTS['waiting'],
      amount: 0
    });
    //Executing function and getting new status of the fund
    let result1 = await putMoney('investor0', 1000000);
    //Executing function and getting new status of the fund
    let result2 = await putMoney('investor1', 1500000);
    //Executing function and getting new status of the fund
    let result3 = await putMoney('investor2', 1500000);
    //verifying that fund is finished
    fund = await searchFund(fund.aspirant_id);
    expect(fund.amount).toEqual(3500000);
    expect(fund.status).toEqual('done');

    let piece1 = await searchPiece('investor0', fund.id);
    let piece2 = await searchPiece('investor1', fund.id);
    let piece3 = await searchPiece('investor2', fund.id);
    expect(piece1 && piece2 && piece3).toBeTruthy();
    //Verifying correct save of investor0
    expect(piece1.id).toEqual(result1.pieces[0].id);
    expect(piece1.amount).toEqual(1000000);
    //Verifying correct save of investor0 
    expect(piece2.id).toEqual(result2.pieces[0].id);
    expect(piece2.amount).toEqual(1500000);
    //expect that last investor just have a piece with 1'000.000
    expect(piece3.id).toEqual(result3.pieces[0].id);
    expect(piece3.amount).toEqual(1000000);
    expect(result3.remain).toEqual(0);

    fund2 = await Funds.findOne({ where: { id: fund2.id } });
    expect(fund2.amount).toEqual(500000);
    expect(fund2.status).toEqual('gathering funds');


    piece1 = await searchPiece('investor0', fund2.id);
    piece2 = await searchPiece('investor1', fund2.id);
    piece3 = await searchPiece('investor2', fund2.id);
    //There wouldn't be pieces of investor 0 and 1 in the fund2


    expect(piece1).toBeFalsy();
    expect(piece2).toBeFalsy();
    //except for investor 2
    expect(piece3).toBeTruthy();
    expect(piece3.amount).toEqual(500000);
  } catch (error) {
    fail(error);
  }
};

describe('Testing piecesLib functionalities', () => {
  it('checking implemented putMoney function', () => expect(putMoney).toBeTruthy());
  it('probing bad inputs to the putMoney function', badInputsTc);
  it('adding money in an empty fund pool', emptyFundPoolTc);
  it('adding money when there are one fund\'s gathering funds not exceding limit of 3\'500.000, fund has 1\'000.000', nonEmptyFundPoolTc1);
  it('adding money in the same fund with the same investor not exceding limit of 3\'500.000, fund has 2\'000.000', nonEmptyFundPoolTc2);
  it('adding money with a new investor, completing the limit 3\'500.000 and exceding by 20000', newInvestorTc);
  it('adding money to a fund exceding limit without another fund to be fund', excedingTc1);
  it('adding money to a fund exceding limit with another waiting fund', excedingTc2);
});
