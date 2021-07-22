const { Router } = require("express");
const Seller =  require('../models/sequelize/Seller');
const TransactionSeq = require('../models/sequelize/Transaction');
const TransactionMon = require('../models/mongo/Transaction');
const { sendErrors } = require('../lib/utils');

const TransactionRouter = Router();

TransactionRouter.post('/', (req,res) => {
    if(!req.body.sellerId || !req.body.cart)
    {
        res.sendStatus(400);
        return;
    }
    let jsonCart = null;
    try {
        jsonCart = JSON.parse(req.body.cart);
    } catch (error) {
        res.sendStatus(400);
        return;
    }
    const transaction = {
        facturationAddress: '62, Fear Street Shadyside 456CA',
        deliveryAddress: '62, Fear Street Shadyside 456CA',
        cart: req.body.cart,
        cb: '424242424242',
        amount: jsonCart.reduce((acc, product) => 
        acc + product.price, 0
        ),
        currency: seller.currency,
        status: 'creating',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    Seller.findOne({
        where: {
            id: req.body.sellerId
        }
    }).then(seller => 
        seller == null ? res.sendStatus(404) :
        Promise.all([
            new TransactionSeq (transaction).save(),
            TransactionMon.create(
                {
                    ...transaction,
                    cart: jsonCart
                })
        ]) 
        .then(([transactionSeq, transactionMon]) =>
            res.sendStatus(200) |
            setTimeout(()=> {
                transactionSeq.status = 'waiting';
                transactionMon.status = 'waiting';
                Promise.all([
                    transactionSeq.save(),
                    transacationMon.save()
                ]).catch((e)=> console.error(e));
            }
            , 15000) 
        ).catch((e)=> sendErrors(req, res, e))
    ).catch((e)=> sendErrors(req, res, e))
})



module.exports = TransactionRouter;