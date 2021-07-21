const {Router} = require("express");
const Transaction = require("../models/mongo/Transaction");
const router = Router();
const checkTokenMiddleWare = require("../middleWares/checkTokenMiddleWare");
const {sendErrors} = require("../lib/utils");

router.use(checkTokenMiddleWare('jwt'));

router.get("/transactions", (req, res) => {
    Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getTime() - 604800000)
                },
                ...(req.user.sellerId && {"Seller.id": req.user.sellerId})
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
        .catch(e => sendErrors(req, res, e))
});

router.get("/operations", (req, res) => {
    Transaction.aggregate([
        {
            $unwind: "$Operations"
        },
        {
            $match: {
                "Operations.createdAt": {
                    $gte: new Date(new Date().getTime() - 604800000)
                },
                ...(req.user.sellerId && {"Seller.id": req.user.sellerId})
            }
        },
        {
            $project: {
                date: {$dateToString: {format: "%Y-%m-%d", date: "$Operations.createdAt"}},
                status: "$status",
            }
        },
        {
            $group: {
                _id: {
                    date: "$date",
                    status: "$status",
                },
                numberOperation: {
                    $sum: 1
                }
            },
        },
        {
            $group:{
                _id: "$_id.date",
                operation: {
                    $addToSet: {
                        status: "$_id.status",
                        number: "$numberOperation",
                    }
                }
            },

        },
        {
            $sort: { "_id.date": 1 }
        },
    ])
        .then(operations => res.json(operations))
        .catch(e => sendErrors(req, res, e))
});

module.exports = router;