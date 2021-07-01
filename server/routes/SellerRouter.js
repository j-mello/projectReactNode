const { Router } = require("express");
const Seller = require("../models/sequelize/Seller");
const ClientCredential = require("../models/sequelize/ClientCredential");
const router = Router();
const { sendErrors } = require("../lib/utils");
const checkTokenMiddleWare = require("../middleWares/checkTokenMiddleWare");
const checkRoleMiddleWare = require("../middleWares/checkRoleMiddleWare");
const {generateRandomString} = require("../lib/utils");

router.use(checkTokenMiddleWare('jwt'));

router.post("/generateCredentials/:id", (req, res) => {
    if (
        req.user.sellerId && req.user.sellerId !== parseInt(req.params.id)
    ) {
        res.sendStatus(403);
        return;
    }

    const newCredentials = {
        clientId: generateRandomString(10),
        clientSecret: generateRandomString(15),
    }

    Seller.findOne({
        where: {id: req.params.id}
    })
        .then(seller =>
            seller == null ?
                res.sendStatus(404) :
                (seller.ClientCredentialClientId && ClientCredential.destroy({
                    where: {clientId: seller.ClientCredentialClientId}
                })) |
                new ClientCredential(newCredentials).save()
                    .then(clientCredential => {
                        seller.ClientCredentialClientId = clientCredential.clientId;
                        seller.save()
                            .then(_ => res.status(200).json(newCredentials))
                            .catch(e => sendErrors(req, res, e))
                    })
                    .catch(e => sendErrors(req, res, e))
        )
        .catch(e => sendErrors(req, res, e))
});

router.use(checkRoleMiddleWare('admin'));

router.get("/", (req, res) => {
   Seller.findAll({
       order: [
           ['id', 'ASC']
       ]})
       .then(sellers => res.json(sellers))
       .catch(e => sendErrors(req, res, e))
});

module.exports = router;
