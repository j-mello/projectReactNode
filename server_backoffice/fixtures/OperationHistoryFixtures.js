const OperationFixtures = require('./OperationFixtures')
const Operation = require("./../models/sequelize/Operation");
const OperationHistory = require("./../models/sequelize/OperationHistory");

class OperationHistoryFixtures {
    static async action () {
        const operationList = await Operation.findAll()

        for (const operation of operationList) {
            await Promise.all([
                new OperationHistory({
                    finish: false,
                    OperationId: operation.id,
                    createdAt: operation.createdAt
                }).save(),
                new OperationHistory({
                    finish: true,
                    OperationId: operation.id,
                    createdAt: new Date(operation.createdAt.getTime() + 1000*15)
                }).save()
            ])
        }
    }

    static executeBefore = OperationFixtures
}

module.exports = OperationHistoryFixtures