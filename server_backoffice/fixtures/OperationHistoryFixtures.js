const OperationFixtures = require('./OperationFixtures')
const Operation = require("./../models/sequelize/Operation");
const OperationHistory = require("./../models/sequelize/OperationHistory");
const { rand } = require('../lib/utils')

class OperationHistoryFixtures {
    static async action () {
        const OperationList = await Operation.findAll()

        for(let i = 1; i <= 150; i++){
            await new OperationHistory({
                state: rand(0,1) === 0,
                OperationId: OperationList[rand(0, OperationList.length - 1)].id
            }).save()
        }
    }

    static executeBefore = OperationFixtures
}

module.exports = OperationHistoryFixtures