const { Router } = require("express");
const Seller = require("../models/sequelize/Seller");
const User = require("../models/sequelize/User");
const router = Router();
const { sendErrors } = require("../lib/utils");
const JWTMiddleWare = require("../middleWares/JWTMiddleWare");
const checkRoleMiddleWare = require("../middleWares/checkRoleMiddleWare");

router.use(JWTMiddleWare);

router.use(checkRoleMiddleWare('admin'));

router.get("/", (req, res) => {
   Seller.findAll({order: [
           ['id', 'ASC']
       ]})
       .then(sellers => res.json(sellers))
       .catch(e => sendErrors(req, res, e))
});

router.post("/valid/:id", (req, res) => {
    Seller.findOne({
        where: { id: req.params.id, validated: false }
    })
        .catch(e => sendErrors(req,res,e))
        .then(seller => {
            if (seller == null)
                res.sendStatus(404)
            else {
                seller.validated = true;
                seller.save()
                    .then(() => res.sendStatus(200))
                    .catch(e => sendErrors(res,req,e));
            }
        });
});

module.exports = router;
