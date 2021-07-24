const { Router } = require("express");

const Seller =  require('../models/sequelize/Seller');
const TransactionSeq = require('../models/sequelize/Transaction');
const TransactionMon = require('../models/mongo/Transaction');
const { sendErrors } = require('../lib/utils');
const Transaction = require("../models/mongo/Transaction");
const checkTokenMiddleWare = require('../middleWares/checkTokenMiddleWare');

const router = Router();

router.post('/', (req,res) => {
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
        currency: jsonCart[0].currency,
        status: 'creating',
        SellerId: parseInt(req.body.sellerId),
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
                    transactionMon.save()
                ]).catch((e)=> console.error(e));
            }
            , 15000) 
        ).catch((e)=> sendErrors(req, res, e))
    ).catch((e)=> sendErrors(req, res, e))
})

router.use(checkTokenMiddleWare('jwt'));

router.get("/", (request, response) => {
    Transaction.find(request.query)
        .then((data) => request.user.sellerId ?
            response.json(data.filter(elt => { return elt.Seller && elt.Seller.id === request.user.sellerId })) :
            response.json(data))
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