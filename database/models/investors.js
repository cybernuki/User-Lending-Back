module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Investors', {
    storeKeeperId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    email: { type: DataTypes.STRING, unique: true },
  }, {
    timestamps: false,
  });
};