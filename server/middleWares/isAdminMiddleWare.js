const User = require("../models/sequelize/User");
const {sendErrors} = require("../lib/utils");

module.exports = function isAdminMiddleWare(req, res, next) {
    if (!req.user) {
        return res.sendStatus(401);
    }
    User.findOne({where: { id: req.user.id }})
        .then(user =>
                user == null || user.SellerId != null ?
                    res.sendStatus(401) :
                    next()
        )
        .catch(e => sendErrors(res,req,e));
}