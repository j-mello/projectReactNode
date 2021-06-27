const { Router } = require("express");
const JWTMiddleWare = require("../middleWares/JWTMiddleWare");
const User = require("../models/sequelize/User");
const Seller = require("../models/sequelize/Seller");
const ClientCredential = require("../models/sequelize/ClientCredential");
const jwt = require('jsonwebtoken');
const { sendErrors } = require("../lib/utils");
const bcrypt = require("bcryptjs");
const oauth2Server = require("../lib/Oauth2Server");
const {oneOf} = require("express-validator");

const router = Router();

router.post("/register-seller", async (req, res) => {
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

router.get("/login", (req,res) => {
    let {password, email} = req.query;
    User.findOne({
        where: {email},
        include: {model: Seller, include: ClientCredential}
    })
        .then(async user =>
            user == null || !(await bcrypt.compare(password,user.password)) || (user.Seller != null && user.Seller.ClientCredential == null) ?
                res.sendStatus(401) :
                res.json({
                    ...user.dataValues,
                    access_token: jwt.sign({
                        id: user.id,
                        email: user.email,
                        ...(user.Seller != null && {sellerId: user.Seller.id})
                    }, process.env.JWT_SECRET, { expiresIn: '3 hours' })
                }))
        .catch(e => sendErrors(req,res,e));
});

router.put('/edit', (req, res) => {
    const {siren,society,urlRedirectConfirm,urlRedirectCancel,currency,numPhone} = req.body;
    User.update(
        {numPhone},
        {
            where: {id: req.user.id}
        })
        .then(_ =>
            req.user.sellerId === null ?
                res.sendStatus(200) :
                Seller.update(
                    {
                        siren,society,urlRedirectConfirm,urlRedirectCancel,currency
                    },
                    {
                        where: {id: req.user.sellerId}
                    })
                    .then(_ => res.sendStatus(200))
                    .catch(e => sendErrors(req,res,e))
        )
        .catch(e => sendErrors(req,res,e));
});

router.put('/editPassword', (req,res) => {
   const {password, password_confirm} = req.body;
   if (password === undefined || password !== password_confirm) {
       res.sendStatus(400);
       return;
   }
   User.update({password}, {where: {id: req.user.id}})
       .then(_ => res.sendStatus(200))
       .catch(e => sendErrors(req,res,e));
});

router.post("/login-oauth2", oauth2Server.grant())

router.use(oauth2Server.authorise());

router.get("/test", (req,res) => {
    res.send("test");
});

module.exports = router;
