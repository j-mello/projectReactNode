const TransactionFixtures = require('./TransactionFixtures')
const Transaction = require("./../models/sequelize/Transaction");
const TransactionHistory = require("./../models/sequelize/TransactionHistory");

class TransactionHistoryFixtures {
    static async action () {
        const transactionList = await Transaction.findAll()

        for (let transaction of transactionList) {

            let promises = [() =>
                new TransactionHistory({
                    status: 'creating',
                    TransactionId: transaction.id,
                    createdAt: transaction.createdAt,
                    updatedAt: transaction.createdAt
                }).save(), () =>
                new TransactionHistory({
                    status: 'waiting',
                    TransactionId: transaction.id,
                    createdAt: new Date(transaction.createdAt.getTime()+1000*30),
                    updatedAt: new Date(transaction.createdAt.getTime()+1000*30)
                }).save()
            ]

            if (['refused', 'partial_refunded', 'refunded', 'captured'].includes(transaction.status)) {
                promises.push(() =>
                    new TransactionHistory({
                        status: transaction.status,
                        TransactionId: transaction.id,
                        createdAt: new Date(transaction.createdAt.getTime()+1000*60),
                        updatedAt: new Date(transaction.createdAt.getTime()+1000*60)
                    }).save()
                )
                promises.push(() => transaction.update({
                    updatedAt: new Date(transaction.createdAt.getTime()+1000*60),
                }, {
                    where: {id: transaction.id}
                }));
            } else {
                promises.push(() => transaction.update({
                    updatedAt: new Date(transaction.createdAt.getTime()+1000*20),
                }, {
                    where: {id: transaction.id}
                }));
            }

            await Promise.all(promises.map(promise => promise()));
        }
    }

    static executeBefore = TransactionFixtures
}

module.exports = TransactionHistoryFixtures