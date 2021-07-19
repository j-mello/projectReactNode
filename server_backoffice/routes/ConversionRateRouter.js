const { Router } = require('express');
const ConversionRate = require('../models/mongo/ConversionRate');

const router = Router();

router.get('/', (req, res) => {
    ConversionRate.find(req.query)
        .then((data) => res.json(data))
        .catch((_) => res.sendStatus(500))
    ;
});

router.post('/', (req, res) => {
    const { baseCurrency, targetCurrency } = req.body;
    if( baseCurrency && targetCurrency) {
        ConversionRate.find({ 'baseCurrency': baseCurrency, 'targetCurrency': targetCurrency})
            .then((data) => data.length === 0 ? res.sendStatus(404) : res.json(data[data.length - 1]))
            .catch((_) => res.sendStatus(500))
        ;
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;