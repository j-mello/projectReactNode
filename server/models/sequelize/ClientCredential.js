const {Model, DataTypes} = require("sequelize");
const conn = require("../../lib/sequelize");
const User = require("./User")

class ClientCredential extends Model {}

ClientCredential.init(
    {
        cliendId: {
            type: DataTypes.INTEGER,
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

ClientCredential.belongsTo(User)
User.hasOne(ClientCredential)

module.exports = ClientCredential;