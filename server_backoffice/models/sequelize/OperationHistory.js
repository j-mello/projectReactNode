const {Model, DataTypes} = require("sequelize");
const conn = require("../../lib/sequelize");
const Operation = require("./Operation");

class OperationHistory extends Model {}

OperationHistory.init(
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
        modelName: "OperationHistory",
    }
);

OperationHistory.belongsTo(Operation);
Operation.hasMany(OperationHistory);

module.exports = OperationHistory;