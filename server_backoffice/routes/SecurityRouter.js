const { Router } = require("express");
const checkTokenMiddleWare = require("../middleWares/checkTokenMiddleWare");
const User = require("../models/sequelize/User");
const Oauth2Token = require("../models/sequelize/Oauth2Token");
const Seller = require("../models/sequelize/Seller");
const ClientCredential = require("../models/sequelize/ClientCredential");
const jwt = require('jsonwebtoken');
const { sendErrors, generateAccessToken } = require("../lib/utils");
const bcrypt = require("bcryptjs");

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

router.post("/login", (req,res) => {
    let {password, email} = req.body;
    User.findOne({
        where: {email},
        include: Seller
    })
        .then(async user =>
            user == null || !(await bcrypt.compare(password,user.password)) || (user.Seller != null && !user.Seller.active) ?
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

router.post("/login-oauth2", (req, res) => {
    const expires_in = 3600;
    const {clientId,clientSecret,grant_type} = req.body;
    if (clientId === undefined || clientSecret === undefined || grant_type !== "client_credentials") {
        res.sendStatus(400);
        return;
    }
    ClientCredential.findOne({
        where: {clientId,clientSecret},
        include: Seller
    })
        .then(clientCredential => {
            if (clientCredential == null)
                res.sendStatus(401)
            else {
                const accessToken = generateAccessToken();
                let expires = new Date().setTime(new Date().getTime()+expires_in*1000);
                new Oauth2Token({
                    accessToken,
                    expires,
                    SellerId: clientCredential.Seller.id
                }).save()
                    .then(_ => res.status(200).json({
                        ...clientCredential.Seller.dataValues,
                        accessToken,
                        expires_in
                    }))
                    .catch(e => sendErrors(req,res,e))
            }
        })
        .catch(e => sendErrors(req,res,e))
})

router.post('/logout-oauth2', checkTokenMiddleWare('oauth2'), (req,res) => {
    Oauth2Token.destroy({
        where: {accessToken: req.token}
    })
        .then(_ => res.sendStatus(200))
        .catch(e => sendErrors(req,res,e));
});

router.use(checkTokenMiddleWare('jwt'));

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

router.put('/edit', async (req, res) => {
    const {siren,society,urlRedirectConfirm,urlRedirectCancel,currency,numPhone} = req.body;
    User.update(
        {numPhone},
        {
            where: {id: req.user.id}
        })
        .then(_ =>
                req.user.sellerId === null ? res.sendStatus(200) :
                    Seller.update(
                        {
                            siren, society, urlRedirectConfirm, urlRedirectCancel, currency
                        },
                        {
                            where: {id: req.user.sellerId}
                        }
                        )
                        .then(_ => res.sendStatus(200))
                        .catch(e => sendErrors(req,res,e))
        )
        .catch(e => sendErrors(req,res,e));
});



module.exports = router;
