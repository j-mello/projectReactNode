/*
const { Router } = require("express");
const { Operation } = require("../models/mongo/Operation");
const Transaction = require('../models/mongo/Transaction');
const checkTokenMiddleWare = require('../middleWares/checkTokenMiddleWare');
const {sendErrors} = require("../lib/utils");

const router = Router();

router.use(checkTokenMiddleWare('jwt'));

router.get("/", (request, response) => {
    Operation.find(request.query)
        .then((data) => response.json(data))
        .catch((e) => response.sendStatus(500));
});

router.post("/", (req, res) => {
    new Operation(req.body)
        .save()
        .then((data) => res.status(201).json(data))
        .catch((e) => res.sendStatus(500));
});

router.get("/:id", (request, response) => {
    const { id } = request.params;
    Operation.findById(id)
        .then((data) =>
            data === null ? response.sendStatus(404) : response.json(data)
        )
        .catch((e) => response.sendStatus(500));
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    Operation.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .then((data) =>
            data !== null ? res.status(200).json(data) : res.sendStatus(404)
        )
        .catch((e) => res.sendStatus(500));
});

router.delete("/:id", (request, response) => {
    const { id } = request.params;
    Operation.findByIdAndDelete(id)
        .then((data) =>
            data === null ? response.sendStatus(404) : response.sendStatus(204)
        )
        .catch((e) => response.sendStatus(500));
});

router.post("/kpi", (req, res) => {
    Transaction.aggregate([
        {
            $unwind: "$Transactions"
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
                date: {$dateToString: {format: "%Y-%m-%d", date: "$Transactions.createdAt"}},
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

module.exports = router;*/
