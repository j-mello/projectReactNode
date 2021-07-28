const Command = require("../../lib/Command")
const fs = require("fs/promises")
const {drop} = require("../../lib/sequalizeloader")
const Seller = require("../../models/sequelize/Seller")
const Transaction = require("../../models/sequelize/Transaction")
const TransactionHistory = require("../../models/sequelize/TransactionHistory")
const Operation = require("../../models/sequelize/Operation")
const OperationHistory = require("../../models/sequelize/OperationHistory")
const TransactionMongo = require("../../models/mongo/Transaction")
const {generateMongoTransaction} = require("../../lib/utils");

module.exports = class LoadFixtures extends Command {
    static commandName = "fixtures:load"
    static description = "Permet de charger les fixtures"


    static async action() {
        const path = __dirname + "/../../fixtures"
        const fixturesLoaded = {}

        const reply = await this.question("Voulez-vous vider la db et charger les fixtures? : yes/no \n")
        if (!["y", "yes"].includes(reply.toLowerCase())) {
            console.log("Opération annulée")
            process.exit()
        }
        await drop()
        await TransactionMongo.deleteMany({})
        console.log("La base de données a été supprimée")

        const fixtures = await fs.readdir(path).then((files) =>
            files.filter((file) => file.endsWith(".js"))
        ).then((files) =>
            files.map((file) =>
                require(path + "/" + file)
            )
        )

        for (let fixture of fixtures) {
            if (!fixturesLoaded[fixture.name] && fixture.action)
                await this.load(fixture, fixturesLoaded)
        }

        const transactions = await Transaction.findAll({
            include: [{
                model: Operation,
                include: [ OperationHistory ]
            },
                TransactionHistory,
                Seller
            ],
            order: [
                ["createdAt", "ASC"],
                ["updatedAt", "ASC"]
            ]
        })

        await TransactionMongo.insertMany(transactions.map((transaction) => generateMongoTransaction(transaction)));
    }

    static async load(fixture, fixturesLoaded) {
        if (fixture.executeBefore) {
            if (!(fixture.executeBefore instanceof Array))
                fixture.executeBefore = [fixture.executeBefore]

            for (let subfixture of fixture.executeBefore) {
                if (!fixturesLoaded[subfixture.name]) {
                    await this.load(subfixture, fixturesLoaded)
                    fixturesLoaded[subfixture.name] = true
                }
            }
        }
        await fixture.action()
        console.log(fixture.name + "a été chargée")
        fixturesLoaded[fixture.name] = true
    }

    static help() {
        console.log("Exemple : node bin/console.js " + this.commandName)
    }
}