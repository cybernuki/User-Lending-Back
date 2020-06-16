module.exports = (sequelize, DataTypes) => {
  const Aspirants = sequelize.define('Aspirants', {
    storeKeeperId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    email: { type: DataTypes.STRING, unique: true },
  }, {
    timestamps: false,
  });

  Aspirants.associate = (models) => {
    models.Aspirants.hasOne(models.Funds, {
      foreignKey: {
        name: 'aspirant_id',
        allowNull: false
      }
    });
  }

  return Aspirants;
};