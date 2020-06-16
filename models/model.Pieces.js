module.exports = (sequelize, DataTypes) => {
  const Pieces = sequelize.define('Pieces', {
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
    investor_email: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
  });
  return Pieces;
}