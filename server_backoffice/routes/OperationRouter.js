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

router.post("/kpi", checkTokenMiddleWare('jwt'), (req, res) => {
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

const createOperation = async (req, res, transactionId, status, amount = null) => {
    const checkStatus = {
        refund: ['refunding','refunded'],
        refuse: ['refusing', 'refused'],
        capture: ['capturing', 'captured']
    }

    if (checkStatus[status] &&
        (amount != null && !(amount = isNumber(amount))) || !(transactionId = isNumber(transactionId))
    ) {
        return res.sendStatus(400);
    }

    let operationStatus = checkStatus[status][0];
    let transactionStatus = checkStatus[status][1];

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

    const totalRefundAmount = transaction.dataValues.Operations.reduce((acc,operation) =>
            ["refunding","partial_refunding"].includes(operation.dataValues.status) ? acc+operation.dataValues.price : acc
        ,0)+amount

    if (["captured","refused","creating"].includes(transaction.dataValues.status) ||
        transaction.dataValues.Operations.find(operation =>
            !operation.dataValues.finish
        ) ||
        (status === "refund" && totalRefundAmount > transaction.dataValues.amount)){

        return res.sendStatus(400)
    }

    if(sellerId && transaction.SellerId !== sellerId)
        return res.sendStatus(403);

    if (amount == null) {
        amount = transaction.amount
    }

    let quotation;
    if (status === "refund") {
        quotation = "Remboursement de "+amount+" "+transaction.currency;
        if (totalRefundAmount < transaction.amount) {
            operationStatus = "partial_"+operationStatus;
            transactionStatus = "partial_"+transactionStatus;
        }
    } else if (status === "refuse") {
        quotation = "Paiement refusé";
    } else if (status === "capture") {
        quotation = "Paiement accepté"
    }

    const operation = await new Operation({
        price: amount,
        quotation,
        status: operationStatus,
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
        transaction.status = transactionStatus;

        const [,,transactionHistory,newOperationHistory] = await Promise.all([
            operation.save(),
            transaction.save(),
            new TransactionHistory({
                status: transactionStatus,
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
}

router.use(checkTokenMiddleWare('both'));

router.post("/refund/:transactionId",  (req, res) =>
    createOperation(req,res,req.params.transactionId,"refund",req.body.amount)
);

router.post("/capture/:transactionId", (req,res) =>
    createOperation(req,res,req.params.transactionId,"capture")
);

router.post("/refuse/:transactionId", (req,res) =>
    createOperation(req,res,req.params.transactionId,"refuse")
);

module.exports = router;
