const { Model, DataTypes } = require("sequelize");
const conn = require("../../lib/sequelize");
const User = require("./User");
const ClientCredential = require('./ClientCredential');
const {addNewCredentials} = require('../../lib/utils');

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
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  },
  {
    sequelize: conn,
    modelName: "Seller",
  }
);

Seller.hasMany(User);
User.belongsTo(Seller);

Seller.hasMany(ClientCredential);
ClientCredential.belongsTo(Seller);

Seller.addHook("beforeUpdate", seller => {
    if (seller.dataValues.active && !seller._previousDataValues.active) {
        addNewCredentials(seller.dataValues.id);
    }
})

module.exports = Seller;
