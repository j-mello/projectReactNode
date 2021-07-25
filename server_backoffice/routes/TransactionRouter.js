const { Router } = require("express");

const Seller =  require('../models/sequelize/Seller');
const TransactionSeq = require('../models/sequelize/Transaction');
const TransactionHistory = require('../models/sequelize/TransactionHistory');
const TransactionMon = require('../models/mongo/Transaction');
const { round } = require('../lib/utils');
const Transaction = require("../models/mongo/Transaction");
const checkTokenMiddleWare = require('../middleWares/checkTokenMiddleWare');

const router = Router();

router.post('/', async (req,res) => {
    if(!req.body.sellerId || !req.body.cart)
    {
        res.sendStatus(400);
        return;
    }

    const seller = await Seller.findOne({
        where: {
            id: req.body.sellerId
        }
    })
    if (seller == null)
        return res.sendStatus(404);

    let jsonCart = null;
    try {
        jsonCart = JSON.parse(req.body.cart);
    } catch (error) {
        res.sendStatus(400);
        return;
    }

    if (jsonCart.find(product => product.currency !== seller.currency)) {
        return res.sendStatus(400);
    }

    const transaction = {
        facturationAddress: '62, Fear Street Shadyside 456CA',
        deliveryAddress: '62, Fear Street Shadyside 456CA',
        cart: req.body.cart,
        cb: '424242424242',
        amount: round(jsonCart.reduce((acc, product) =>
            acc + product.price*product.quantity, 0
        ),2),
        currency: seller.currency,
        status: 'creating',
        SellerId: parseInt(req.body.sellerId),
        createdAt: new Date(),
        updatedAt: new Date()
    };


    const transactionSeq = await new TransactionSeq(transaction).save();
    const transactionHistory = await new TransactionHistory({
        status: 'creating',
        TransactionId: transactionSeq.id
    }).save();

    const transactionMon = await TransactionMon.create({
        id: transactionSeq.id,
        ...transaction,
        cart: jsonCart,
        Seller: seller.dataValues,
        TransactionHistories: [transactionHistory.dataValues]
    });

    res.sendStatus(200);
    setTimeout(()=> {
        transactionSeq.status = 'waiting';
        transactionMon.status = 'waiting';
        transactionMon.TransactionHistories.push({status: 'waiting', createdAt: new Date(), updatedAt: new Date()});

        Promise.all([
            transactionSeq.save(),
            transactionMon.save(),
            new TransactionHistory({
                status: 'waiting',
                TransactionId: transactionSeq.id
            }).save()
        ]);
    }, 15000)
})

router.use(checkTokenMiddleWare('both'));

router.get("/", (request, response) => {
    const sellerId = (request.user && request.user.sellerId) ?
        request.user.sellerId :
        request.seller ?
            request.seller.id :
            null;

    if(sellerId && parseInt(request.query.sellerId) !== sellerId) {
        return response.sendStatus(403);
    }

    Transaction.find(sellerId ? { "Seller.id": sellerId} : {}).sort({createdAt: -1})
        .then((data) => response.json(data))
        .catch((e) => response.sendStatus(500));
});

router.get("/:id", (request, response) => {
    const { id } = request.params;
    Transaction.findById(id)
        .then((data) =>
            data === null ? response.sendStatus(404) : response.json(data)
        )
        .catch((e) => response.sendStatus(500));
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    Transaction.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .then((data) =>
            data !== null ? res.status(200).json(data) : res.sendStatus(404)
        )
        .catch((e) => res.sendStatus(500));
});

router.delete("/:id", (request, response) => {
    const { id } = request.params;
    Transaction.findByIdAndDelete(id)
        .then((data) =>
            data === null ? response.sendStatus(404) : response.sendStatus(204)
        )
        .catch((e) => response.sendStatus(500));
});

router.post("/kpi", (req,res) => {
    if(req.body.sellerId === undefined && req.user.sellerId != undefined)
        return res.sendStatus(403)

    Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getTime() - 604800000)
                },
                ...(req.body.sellerId && {"Seller.id": parseInt(req.body.sellerId)})
            }
        },
        {
            $project: {
                date: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}}
            }
        },
        {
            $group: {
                _id: "$date",
                numberTransaction: {
                    $sum: 1
                }
            }
        },
        {
            $sort: { "_id": 1 }
        },
    ])
        .then(transaction => res.json(transaction))
        .catch(e => res.status(200).json({error: e})/*sendErrors(req, res, e)*/)
});

module.exports = router;