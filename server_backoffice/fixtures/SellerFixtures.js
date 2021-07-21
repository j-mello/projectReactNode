const Seller = require('../models/sequelize/Seller') 
const User = require('../models/sequelize/User')

class SellerFixtures {
    static async action () {
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
                currency: "EUR",
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