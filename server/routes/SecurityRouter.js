const { Router } = require("express");
const JWTMiddleWare = require("../lib/JWTMiddleWare");
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
                res.sendStatus(403) :
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
   const {siren,society,urlRedirectConfirm,urlRedirectCancel,currency} = req.body;
   const {email,password,numPhone} = req.body;

   new User({email,password,numPhone}).save()
       .then(user => {
           new Seller({siren,society,urlRedirectConfirm,urlRedirectCancel,currency}).save()
               .then(seller => {
                    user.SellerId = seller.id;
                    user.save()
                        .then(_ => res.sendStatus(200))
                        .catch(e => sendErrors(res,req,e))
               })
               .catch(e => {
                   User.destroy({where: {id: user.id}})
                       .then(() => sendErrors(res,req,e))
                       .catch(e => sendErrors(res,req,e));
               });
       })
       .catch(e => sendErrors(res,req,e))
});

router.get("/test", JWTMiddleWare, (req,res) => {
    res.send("Your are connected !");
});

module.exports = router;