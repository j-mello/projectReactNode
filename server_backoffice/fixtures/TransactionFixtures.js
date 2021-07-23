const SellerFixtures = require("./SellerFixtures")
const Seller = require('../models/sequelize/Seller')
const Transaction = require('../models/sequelize/Transaction')
const { rand } = require('../lib/utils')

class TransactionFixtures {
    static async action() {
        const sellerIdList = await Seller.findAll()

        const transactionStatus = ['creating', 'waiting', 'refused', 'partial_refunded', 'refunded', 'captured']

        for (let i = 1; i <= 50; i++) {
            await new Transaction({
                facturationAddress: "2 rue des bananes",
                deliveryAddress: "2 rue des bananes",
                cb: "4242424242424242",
                cart: JSON.stringify([
                    {
                        name: "Bananes",
                        price: rand(1, 100),
                        quantity: rand(1, 10),
                    },
                    {
                        name: "Pommes",
                        price: rand(1, 100),
                        quantity: rand(1, 10),
                    },
                    {
                        name: "Poires",
                        price: rand(1, 100),
                        quantity: rand(1, 10),
                    },
                ]),
                amount: rand(1000, 20000)/100,
                currency: "EUR",
                status: transactionStatus[rand(0, transactionStatus.length - 1)],
                SellerId: sellerIdList[rand(0, sellerIdList.length - 1)].id,
                createdAt: new Date(rand(new Date().getTime()-604800000, new Date().getTime()))
            }).save()
        }
    }

    static executeBefore = SellerFixtures
}

module.exports = TransactionFixtures