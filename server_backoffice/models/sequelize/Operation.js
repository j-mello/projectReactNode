const {Model, DataTypes} = require("sequelize");
const conn = require("../../lib/sequelize");
const Transaction = require("./Transaction");

class Operation extends Model {}

Operation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        quotation: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        finish: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        sequelize: conn,
        modelName: "Operation",
    }
);

Operation.belongsTo(Transaction);
Transaction.hasMany(Operation);

module.exports = Operation;