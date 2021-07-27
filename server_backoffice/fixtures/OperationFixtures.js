const TransactionFixtures = require('./TransactionFixtures')
const Operation = require('../models/sequelize/Operation')
const Transaction = require('../models/sequelize/Transaction')

class OperationFixtures {
    static async action () {
        const transactionList = await Transaction.findAll();
        const operationStatusByTransactionStatus = {
            refused: 'refusing',
            partial_refunded: 'partial_refunding',
            refunded: 'refunding',
            captured: 'capturing'
        }

        for (const transaction of transactionList) {
            if (['refused', 'partial_refunded', 'refunded', 'captured'].includes(transaction.status)) {
                await new Operation({
                    price: transaction.status === "partial_refunded" ?
                        JSON.parse(transaction.cart)[0].price : transaction.amount,
                    quotation: "This is a quotation",
                    status: operationStatusByTransactionStatus[transaction.status],
                    finish: true,
                    TransactionId: transaction.id,
                    createdAt: new Date(transaction.createdAt.getTime() + 1000*45),
                    updatedAt: new Date(transaction.createdAt.getTime() + 1000*60)
                }).save();
            }
        }
    }

    static executeBefore = TransactionFixtures
}

module.exports = OperationFixtures