const FUNDS_STATUTS = ['waiting', 'gathering funds', 'done'];

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Funds', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.ENUM(FUNDS_STATUTS)
    }
  }, {
    timestamps: false,
  });
};