const jwt = require('jsonwebtoken');

const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

const  checkTokenMiddleware = (req, res, next) => {
    // Récupération du token
    const token = req.query.token || req.body.token || (req.headers.authorization && extractBearerToken(req.headers.authorization));

    // Présence d'un token
    if (!token) {
        return res.sendStatus(401);
    }

    // Véracité du token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            res.sendStatus(401);
        } else {
            return next()
        }
    })
}

module.exports = checkTokenMiddleware;