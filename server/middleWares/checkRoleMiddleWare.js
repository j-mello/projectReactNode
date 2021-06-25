const {Op} = require("sequelize");
const User = require("../models/sequelize/User");
const {sendErrors} = require("../lib/utils");


// role => admin | seller
module.exports = function checkRoleMiddleWare(role = "admin") {
    return function (req, res, next) {
        if (!req.user) {
            return res.sendStatus(401);
        }
        User.findOne({where: {
            id: req.user.id,
            ...(role === "admin" ? {SellerId: {[Op.is]: null}} : {SellerId: {[Op.ne]: null}})
        }})
            .then(user =>
                user == null ?
                    res.sendStatus(401) :
                    next()
            )
            .catch(e => sendErrors(res,req,e));
    }
}
