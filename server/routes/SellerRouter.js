const { Router } = require("express");
const { Op } = require("sequelize");
const Seller = require("../models/sequelize/Seller");
const ClientCredential = require("../models/sequelize/ClientCredential");
const router = Router();
const { sendErrors } = require("../lib/utils");
const JWTMiddleWare = require("../middleWares/JWTMiddleWare");
const checkRoleMiddleWare = require("../middleWares/checkRoleMiddleWare");
const {generateClientIdAndClientSecret} = require("../lib/utils");

router.use(JWTMiddleWare);

router.use(checkRoleMiddleWare('admin'));

router.get("/", (req, res) => {
   Seller.findAll({
       order: [
           ['id', 'ASC']
       ]})
       .then(sellers => res.json(sellers))
       .catch(e => sendErrors(req, res, e))
});

router.post("/valid/:id", (req, res) => {
    Seller.findOne({
        where: { id: req.params.id, "ClientCredentialClientId": {[Op.is]: null}}
    })
        .then(seller =>
            seller == null ?
                res.sendStatus(404) :
                new ClientCredential({
                    clientId: generateClientIdAndClientSecret(10),
                    clientSecret: generateClientIdAndClientSecret(15),
                }).save()
                    .then(clientCredential => {
                        seller.ClientCredentialClientId = clientCredential.clientId;
                        seller.save()
                            .then(_ => res.sendStatus(200))
                            .catch(e => sendErrors(req,res,e))
                    })
                    .catch(e => sendErrors(req,res,e))

        )
        .catch(e => sendErrors(req,res,e))
});

module.exports = router;
