const { Router } = require("express");
const JWTMiddleWare = require("../lib/JWTMiddleWare");
const User = require("../models/sequelize/User");
const jwt = require('jsonwebtoken');
const { hashPassword } = require("../lib/utils");
const bcrypt = require("bcryptjs");

const router = Router();

router.get("/login", async (req,res) => {
    let {password, email} = req.query;
    if (!password || !email) {
        res.sendStatus(500);
    } else {
        User.findOne({where: {email}})
            .then(async user =>
                user == null || !(await bcrypt.compare(password,user.password)) ?
                    res.sendStatus(404) :
                    res.json({
                        access_token: jwt.sign({
                            id: user.id,
                            email: user.email
                        }, process.env.JWT_SECRET, { expiresIn: '3 hours' })
                    }))
            .catch(e => {
                console.error(e);
                res.sendStatus(500);
            });
    }
});

router.get("/test", JWTMiddleWare, (req,res) => {
    res.send("Your are connected !");
});

module.exports = router;