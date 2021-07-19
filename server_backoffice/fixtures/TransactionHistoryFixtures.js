const TransactionFixtures = require('./TransactionFixtures')
const Transaction = require("./../models/sequelize/Transaction");
const TransactionHistory = require("./../models/sequelize/TransactionHistory");
const { rand } = require('../lib/utils')

class TransactionHistoryFixtures {
    static async action () {
        const TransactionList = await Transaction.findAll()
        const transactionHistoryStatus = ['creating', 'waiting', 'refused', 'partial_refunded', 'refunded', 'captured']

        for(let i = 1; i <= 50; i++){
            await new TransactionHistory({
                status: transactionHistoryStatus[rand(0, transactionHistoryStatus.length - 1)],
                TransactionId: TransactionList[rand(0, TransactionList.length - 1)].id
            }).save()
        }
    }

    static executeBefore = TransactionFixtures
}

module.exports = TransactionHistoryFixtures