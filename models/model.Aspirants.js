module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Aspirants', {
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