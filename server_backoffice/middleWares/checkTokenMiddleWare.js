const jwt = require('jsonwebtoken');
const Oauth2Token = require('../models/sequelize/Oauth2Token');
const ClientCredential = require('../models/sequelize/ClientCredential');
const Seller = require('../models/sequelize/Seller');

const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}
// type : jwt, oauth2 or both
const checkTokenMiddleWare = (type = "both") => async (req, res, next) => {
    const token = req.query.token || req.body.token || (req.headers.authorization && extractBearerToken(req.headers.authorization));

    if (!token) {
        return res.sendStatus(401);
    }

    req.token = token;

    if (type === "jwt" || type === "both") {
        const user = await (() => {
            return new Promise((resolve => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                    if (err)
                        resolve(false)
                    else
                        resolve(decodedToken);
                })
            }));
        })();
        if (user) {
            req.user = user;
            next();
            return;
        }
    }
    if (type === "oauth2" || type === "both") {
        const oauth2Token = await Oauth2Token.findOne({
            where: {accessToken: token},
            include: Seller
        })
        if (oauth2Token != null) {
            if (oauth2Token.expires >= new Date()) {
                req.seller = oauth2Token.Seller;
                next();
                return;
            }
            Oauth2Token.destroy({
                where: {accessToken: token}
            });
        }
    }

    res.sendStatus(401)
}

module.exports = checkTokenMiddleWare;
