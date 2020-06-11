const FUNDS_STATUTS = { waiting: 'waiting', gathering: 'gathering funds', done: 'done' };

module.exports = (sequelize, DataTypes) => {
  const Funds = sequelize.define('Funds', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(Object.values(FUNDS_STATUTS)),
      defaultValue: FUNDS_STATUTS['waiting'],
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
        allowNull: false,
        unique: true
      }
    });
    models.Funds.hasMany(models.Pieces, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'fund_id',
        allowNull: false,
        unique: true,
      }
    });
  }



  Funds.FUNDS_STATUTS = FUNDS_STATUTS;
  return Funds;
};