const {Model, DataTypes} = require("sequelize");
const conn = require("../../lib/sequelize");

class Transaction extends Model {}

Transaction.init(
    {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        facturationAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deliveryAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cart: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cb: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: conn,
        modelName: "Transaction",
    }
);

module.exports = Transaction;