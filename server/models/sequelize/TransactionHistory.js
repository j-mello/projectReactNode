const {Model, DataTypes} = require("sequelize");
const conn = require("../../lib/sequelize");
const Transaction = require("./Transaction");

class TransactionHistory extends Model {}

TransactionHistory.init(
    {
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: conn,
        modelName: "TransactionHistory",
    }
);

TransactionHistory.belongsTo(Transaction);
Transaction.hasMany(TransactionHistory);

module.exports = TransactionHistory;