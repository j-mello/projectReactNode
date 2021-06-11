const { Router } = require("express");
const JWTMiddleWare = require("../middleWares/JWTMiddleWare");
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
        .catch(e => sendErrors(req,res,e));
});

router.use(JWTMiddleWare);

router.get("/test", (req,res) => {
    console.log(req.user);
    res.send("Your are connected !");
});



module.exports = router;