const User = require("../models/sequelize/User");
const {sendErrors} = require("../lib/utils");


// role => admin | seller
module.exports = function checkRoleMiddleWare(role = "admin") {
    return function (req, res, next) {
        if (!req.user) {
            return res.sendStatus(401);
        }
        User.findOne({where: { id: req.user.id }})
            .then(user =>
                user == null ||
                (role === "admin" && user.SellerId != null) ||
                (role === "seller" && user.SellerId == null) ?
                    res.sendStatus(401) :
                    next()
            )
            .catch(e => sendErrors(res,req,e));
    }
}
