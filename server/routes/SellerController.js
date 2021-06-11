const { Router } = require("express");
const Seller = require("../models/sequelize/Seller");
const User = require("../models/sequelize/User");
const router = Router();
const { sendErrors } = require("../lib/utils");
const JWTMiddleWare = require("../middleWares/JWTMiddleWare");
const isAdminMiddleWare = require("../middleWares/isAdminMiddleWare");


router.post("/register", async (req, res) => {
    const {siren,society,urlRedirectConfirm,urlRedirectCancel,currency} = req.body;
    const {email,password,numPhone} = req.body;

    new User({email,password,numPhone}).save()
        .then(user => {
            new Seller({siren,society,urlRedirectConfirm,urlRedirectCancel,currency}).save()
                .then(seller => {
                    user.SellerId = seller.id;
                    user.save()
                        .then(_ => res.sendStatus(200))
                        .catch(e => sendErrors(req,res,e))
                })
                .catch(e => {
                    User.destroy({where: {id: user.id}})
                        .then(() => sendErrors(req,res,e))
                        .catch(e => sendErrors(req,res,e));
                });
        })
        .catch(e => sendErrors(req,res,e))
});

router.use(JWTMiddleWare);
router.use(isAdminMiddleWare);

router.get("/", (req, res) => {
   Seller.findAll()
       .then(sellers => res.json(sellers))
       .catch(e => sendErrors(req, res, e))
});

router.post("/valid/:id", (req, res) => {
    Seller.findOne({
        where: { id: req.params.id, validated: false },
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