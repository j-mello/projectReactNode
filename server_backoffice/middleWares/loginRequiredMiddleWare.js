const loginRequiredMiddleWare = (req, res, next) =>
    (req.user || req.seller)  ? next() : res.send(401)

module.exports = loginRequiredMiddleWare;