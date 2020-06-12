const { aspirantsLib, fundPool } = require('../lib'),
  { getAll, search } = aspirantsLib,
  { registAspirant } = fundPool;

const aspirantsController = {};

aspirantsController.getAll = async (req, res, next) => {
  const aspirants = await getAll()
  return res.json({
    status: 'ok',
    data: aspirants
  });
};

aspirantsController.search = async (req, res, next) => {
  const { aspirant, fund } = await search(req.params.aspirant_id)
  console.log(aspirant)
  const status = (aspirant) ? 'ok' : 'not_found';
  return res.json({
    status: status,
    aspirant: aspirant,
    fund: fund
  });
};

aspirantsController.registAspirant = async (req, res, next) => {
  data = req.body;
  if (!data.email || !data.password) return res.status(400).json({ 'message': 'Bad body' });
  let result = await registAspirant(data.email, data.password);
  console.log(result)
  return res.json(result);
};

module.exports = aspirantsController;