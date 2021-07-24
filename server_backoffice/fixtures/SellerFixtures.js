const Seller = require('../models/sequelize/Seller') 
const User = require('../models/sequelize/User')
const ConversionRate = require('../models/mongo/ConversionRate');
const { rand } = require('../lib/utils');

class SellerFixtures {
    static async action () {
        const currencies = await ConversionRate.find({}).then(conversionsRate =>
            conversionsRate.map(conversionRate => (
                conversionRate.targetCurrency
            )))
        await new User({
            email: "admin@admin",
            password: "1234",
            numPhone: "0123456789",
        }).save()

        for(let i = 1; i <= 5; i++){
            const seller = await new Seller({
                siren: "123456789",
                society: "Society" + i,
                urlRedirectConfirm: "/confirm",
                urlRedirectCancel: "/cancel",
                currency: currencies.length > 0 ? currencies[rand(0, currencies.length - 1)] : "EUR",
                active: true
            }).save()

            await new User ({
                email: "seller" + i + "@seller",
                password: "test",
                numPhone: "0123456789",
                SellerId: seller.id
            }).save()
        }
    }
}

module.exports = SellerFixtures