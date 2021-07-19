const TransactionFixtures = require('./TransactionFixtures')
const Operation = require('../models/sequelize/Operation')
const Transaction = require('../models/sequelize/Transaction')
const { rand } = require('../lib/utils')

class OperationFixtures {
    static async action () {
        const transactionList = await Transaction.findAll()
        const operationStatus = ['refusing', 'partial_refunding', 'refunding', 'capturing']

        for(let i = 1; i <= 150; i++){
            await new Operation({
                cb: "4242424242424242",
                price: rand(1000,5000)/100,
                quotation: "Text",
                status: operationStatus[rand(0, operationStatus.length - 1)],
                finish: rand(0,1) === 0,
                TransactionId: transactionList[rand(0, transactionList.length - 1)].id
            }).save()
        }
    }

    static executeBefore = TransactionFixtures
}

module.exports = OperationFixtures