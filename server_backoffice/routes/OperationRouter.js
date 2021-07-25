const { Router } = require("express");
const Operation = require("../models/sequelize/Operation");
const OperationHistory = require("../models/sequelize/OperationHistory");
const TransactionHistory = require("../models/sequelize/TransactionHistory");
const Seller = require("../models/sequelize/Seller");
const TransactionMongo = require('../models/mongo/Transaction');
const TransactionSeq = require('../models/sequelize/Transaction');
const checkTokenMiddleWare = require('../middleWares/checkTokenMiddleWare');
const {sendErrors, isNumber, generateMongoTransaction} = require("../lib/utils");

const router = Router();

router.post("/refund/:transactionId", checkTokenMiddleWare('both'),  async (req, res) => {

    let { transactionId } = req.params,
        {amount} = req.body;

    if (!(amount = isNumber(amount)) || !(transactionId = isNumber(transactionId))) {
        return res.sendStatus(400);
    }

    const transaction = await TransactionSeq.findOne({
        where: {id: transactionId},
        include: [
            Seller,
            {model: Operation, include: [OperationHistory]},
            TransactionHistory
        ]
    });

    const sellerId = (req.user && req.user.sellerId) ?
        req.user.sellerId :
        req.seller ?
            req.seller.id :
            null;

    if (transaction == null)
        return res.sendStatus(404);

    if (transaction.status !== "waiting" || (sellerId && transaction.SellerId !== sellerId))
        return res.sendStatus(403)

    if (amount > transaction.amount) {
        return res.sendStatus(400);
    }

    const operation = await new Operation({
        price: amount,
        quotation: "Remboursement de "+amount+" "+transaction.currency,
        status: amount === transaction.amount ? 'refunding' : 'partial_refunding',
        finish: false,
        TransactionId: transactionId
    }).save();

    const operationHistory = await new OperationHistory({
        finish: false,
        OperationId: operation.id
    }).save();

    await TransactionMongo.deleteOne({id: transactionId});

    await TransactionMongo.create(generateMongoTransaction(
        transaction,
        [{
            ...operation.dataValues,
            OperationHistories: [operationHistory.dataValues]
        }]
    ))

    res.sendStatus(201);

    setTimeout(async () => {
        operation.finish = true;
        transaction.status = amount === transaction.amount ? 'refunded' : 'partial_refunded';

        const [,,transactionHistory,newOperationHistory] = await Promise.all([
            operation.save(),
            transaction.save(),
            new TransactionHistory({
                status: amount === transaction.amount ? 'refunded' : 'partial_refunded',
                TransactionId: transaction.id
            }).save(),
            new OperationHistory({
                finish: true,
                OperationId: operation.id
            }).save()
        ]);

        await TransactionMongo.deleteOne({id: transactionId});

        await TransactionMongo.create(generateMongoTransaction(
            transaction,
            [{
                ...operation.dataValues,
                OperationHistories: [operationHistory.dataValues,newOperationHistory.dataValues]
            }],
            [transactionHistory.dataValues]
        ))
    }, 15000)

});

router.use(checkTokenMiddleWare('jwt'));

router.post("/kpi", (req, res) => {
    if(req.body.sellerId === undefined && req.user.sellerId != undefined)
        return res.sendStatus(403)

    TransactionMongo.aggregate([
        {
            $unwind: "$Operations"
        },
        {
            $match: {
                "Operations.createdAt": {
                    $gte: new Date(new Date().getTime() - 604800000)
                },
                ...(req.body.sellerId && {"Seller.id": parseInt(req.body.sellerId)})
            }
        },
        {
            $project: {
                date: {$dateToString: {format: "%Y-%m-%d", date: "$Operations.createdAt"}},
                status: "$Operations.status",
            }
        },
        {
            $group: {
                _id: {
                    date: "$date",
                    status: "$status",
                },
                numberOperations: {
                    $sum: 1
                }
            },
        },
        {
            $group:{
                _id: "$_id.date",
                operations: {
                    $addToSet: {
                        status: "$_id.status",
                        number: "$numberOperations",
                    }
                }
            },

        },
        {
            $sort: { "_id": 1 }
        },
    ])
        .then(operations => res.json(operations))
        .catch(e => sendErrors(req, res, e))
});

module.exports = router;
