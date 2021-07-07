
// role => admin | seller
module.exports = function checkRoleMiddleWare(role = "admin") {
    return function (req, res, next) {
        if ((req.user && (
            (role === "admin" && req.user.sellerId === undefined) ||
            (role === "seller" && req.user.sellerId !== undefined)))
            ||
            req.seller && role === "seller"
        )
            next()
        else
            res.sendStatus(401);
    }
}
