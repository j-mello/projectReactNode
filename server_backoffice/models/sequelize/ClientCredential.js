const {Model, DataTypes} = require("sequelize");
const conn = require("../../lib/sequelize");

class ClientCredential extends Model {}

ClientCredential.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        clientId: {
            type: DataTypes.STRING,
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

module.exports = ClientCredential;
