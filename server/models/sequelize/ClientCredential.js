const {Model, DataTypes} = require("sequelize");
const conn = require("../../lib/sequelize");
const Seller = require("./Seller")

class ClientCredential extends Model {}

ClientCredential.init(
    {
        clientId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        clientSecret: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: conn,
        modelName: "ClientCredential",
    }
);

ClientCredential.hasOne(Seller)
Seller.belongsTo(ClientCredential)

module.exports = ClientCredential;
