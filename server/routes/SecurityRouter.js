const { Router } = require("express");
const JWTMiddleWare = require("../middleWares/JWTMiddleWare");
const isAdminMiddleWare = require("../middleWares/isAdminMiddleWare");
const User = require("../models/sequelize/User");
const Seller = require("../models/sequelize/Seller");
const jwt = require('jsonwebtoken');
const { sendErrors } = require("../lib/utils");
const bcrypt = require("bcryptjs");

const router = Router();

router.get("/login", (req,res) => {
    let {password, email} = req.query;
    User.findOne({where: {email}, include: Seller})
        .then(async user =>
            user == null || !(await bcrypt.compare(password,user.password)) || (user.Seller != null && !user.Seller.validated) ?
                res.sendStatus(401) :
                res.json({
                    ...user.dataValues,
                    access_token: jwt.sign({
                        id: user.id,
                        email: user.email
                    }, process.env.JWT_SECRET, { expiresIn: '3 hours' })
                }))
        .catch(e => {
            console.error(e);
            res.sendStatus(500);
        });
});

router.post("/seller-register", async (req, res) => {
    const {email,password,numPhone,
        siren,society,urlRedirectConfirm,urlRedirectCancel,currency
    } = req.body;

    new User({
        email, password, numPhone,
        Seller: {
            siren, society, urlRedirectConfirm, urlRedirectCancel, currency
        }
    }, {
        include: Seller
    }).save()
        .then(_ => res.sendStatus(200))
        .catch(e => sendErrors(res,req,e))
});

router.use(JWTMiddleWare);

router.get("/test", (req,res) => {
    console.log(req.user);
    res.send("Your are connected !");
});

router.use(isAdminMiddleWare);

router.post("/confirm-seller/:id", (req, res) => {
    Seller.findOne({
        where: { id: req.params.id, validated: false },
    })
        .catch(e => sendErrors(res,req,e))
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