const SellerFixtures = require("./SellerFixtures")
const Seller = require('../models/sequelize/Seller')
const Transaction = require('../models/sequelize/Transaction')
const { rand } = require('../lib/utils')

class TransactionFixtures {
    static async action() {
        const sellerList = await Seller.findAll()

        const transactionStatus = ['waiting', 'refused', 'partial_refunded', 'refunded', 'captured']

        for (let i = 1; i <= 1000; i++) {
            const seller = sellerList[rand(0, sellerList.length - 1)];
            const cart = [
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
            ];
            const amount = cart.reduce((acc,product) =>
                acc + product.price*product.quantity
            , 0)
            await new Transaction({
                facturationAddress: "2 rue des bananes",
                deliveryAddress: "2 rue des bananes",
                cb: "4242424242424242",
                cart: JSON.stringify(cart),
                amount: amount,
                currency: seller.currency,
                status: transactionStatus[rand(0, transactionStatus.length - 1)],
                SellerId: seller.id,
                createdAt: new Date(rand(new Date().getTime()-604800000, new Date().getTime()))
            }).save()
        }
    }

    static executeBefore = SellerFixtures
}

module.exports = TransactionFixtures