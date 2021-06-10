const { Model, DataTypes } = require("sequelize");
const conn = require("../../lib/sequelize");
const User = require("./User")

class Seller extends Model {}

Seller.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    siren: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    society: {
        type: DataTypes.STRING,
        allowNull: false
    },
    urlRedirectConfirm: {
        type: DataTypes.STRING,
        allowNull: false
    },
    urlRedirectCancel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    validated:  {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
  },
  {
    sequelize: conn,
    modelName: "Seller",
  }
);

Seller.hasMany(User);
User.belongsTo(Seller);

module.exports = Seller;
