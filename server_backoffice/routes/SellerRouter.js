const { Router } = require("express");
const Seller = require("../models/sequelize/Seller");
const router = Router();
const checkTokenMiddleWare = require("../middleWares/checkTokenMiddleWare");
const checkRoleMiddleWare = require("../middleWares/checkRoleMiddleWare");
const loginRequiredMiddleWare = require("../middleWares/loginRequiredMiddleWare");
const {sendErrors} = require("../lib/utils");

router.use(checkTokenMiddleWare('jwt', false));

router.get("/", (req, res) => {
   Seller.findAll({
       ...((req.user === undefined || req.user.sellerId !== undefined) && {
          where: {active: true}
       }),
       order: [
           ['id', 'ASC']
       ]})
       .then(sellers => res.json(sellers))
       .catch(e => sendErrors(req, res, e))
});

router.use(loginRequiredMiddleWare);

router.use(checkRoleMiddleWare('admin'));

router.post("/:id/active", (req,res) => {
    Seller.findOne({where: {id: req.params.id, active: false}})
        .then(seller => {
            if (seller == null)
                res.sendStatus(404)
            else {
                seller.active = true;
                seller.save()
                    .then(_ => res.sendStatus(202))
                    .catch(e => sendErrors(req,res,e));
            }
        })
        .catch(e => sendErrors(req,res,e));
});

module.exports = router;
