const { Router } = require("express");
const Transaction = require("../models/mongo/Transaction");
const checkTokenMiddleWare = require('../middleWares/checkTokenMiddleWare');
const {sendErrors} = require("../lib/utils");

const router = Router();

router.use(checkTokenMiddleWare('jwt'));

router.get("/", (request, response) => {
    Transaction.find(request.query)
        .then((data) => request.user.sellerId ?
            response.json(data.filter(elt => { return elt.Seller && elt.Seller.id === request.user.sellerId })) :
            response.json(data))
        .catch((e) => response.sendStatus(500));
});

router.post("/", (req, res) => {
    new Transaction(req.body)
        .save()
        .then((data) => res.status(201).json(data))
        .catch((e) => res.sendStatus(500));
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