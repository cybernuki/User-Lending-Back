module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Investors', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    amount: {
      type: DataTypes.FLOAT
    }
  }, {
    timestamps: false,
  });
};