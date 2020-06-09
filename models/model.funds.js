const FUNDS_STATUTS = ['waiting', 'gathering funds', 'done'];

module.exports = (sequelize, DataTypes) => {
  const Funds = sequelize.define('Funds', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(FUNDS_STATUTS),
      allowNull: false
    }
  }, {
    timestamps: true,
  });

  Funds.associate = (models) => {
    models.Funds.belongsTo(models.Aspirants, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'aspirant_id',
        allowNull: false
      }
    });
  }

  Funds.FUNDS_STATUTS = FUNDS_STATUTS;
  return Funds;
};