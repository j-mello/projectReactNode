const { Router } = require("express");
const checkTokenMiddleWare = require("../middleWares/checkTokenMiddleWare");
const checkRoleMiddleWare = require("../middleWares/checkRoleMiddleWare");
const {sendErrors, addNewCredentials, generateRandomString} = require("../lib/utils");
const ClientCredential = require("../models/sequelize/ClientCredential");

const router = Router();

router.use(checkTokenMiddleWare('jwt'));
router.use(checkRoleMiddleWare('seller'));

router.get("/", (req, res) => {
    ClientCredential.findAll({
        where: {SellerId: req.user.sellerId},
        order: [
            ['id','ASC']
        ]
    })
        .then(sellers => res.status(200).json(sellers))
        .catch(e => sendErrors(req,res,e));
});

router.post("/", (req,res) => {
    addNewCredentials(req.user.sellerId)
        .then(credential => res.status(201).json(credential.dataValues))
        .catch(e => sendErrors(req,res,e));
});

router.delete("/:id", (req,res) => {
    ClientCredential.destroy({where: {SellerId: req.user.sellerId, id: req.params.id}})
        .then(deleted => deleted === 0 ? res.sendStatus(404) : res.sendStatus(204))
        .catch(e => sendErrors(req,res,e));

});

router.put("/:id", (req, res) => {
    const newCredential = {
        clientId: generateRandomString(10),
        clientSecret: generateRandomString(15)
    };
    ClientCredential.update(
        newCredential,
        {
            where: {
                id: req.params.id,
                SellerId: req.user.sellerId
            }
        })
        .then(([updated]) => updated > 0 ? res.status(200).json({...newCredential, id: req.params.id}) : res.sendStatus(404))
        .catch(e => sendErrors(req,res,e));
});

module.exports = router;