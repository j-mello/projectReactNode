const ClientCredential = require("../models/sequelize/ClientCredential");


const sendErrors = (req, res, e) => {
    console.error(e);
    res.status(e.message === "Validation error" || e.name === "SequelizeValidationError" ? 400 : 500).json({
        errors: e.errors ? e.errors.map(error => error.message) : [e.message]
    });
}


const generateRandomString = (n, forbiddenChars = []) => {
    const chars = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789$!?%&";
    let token = "";
    while (token.length < n) {
        const char = chars[rand(0, chars.length - 1)];
        if (!forbiddenChars.includes(char))
            token += char;
    }
    return token;
}


const generateAccessToken = () => generateRandomString(50, ['$', '!', '?', '%', '&'])

const addNewCredentials = (SellerId) => new ClientCredential({
    clientId: generateRandomString(10),
    clientSecret: generateRandomString(15),
    SellerId
}).save();

const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

module.exports = { sendErrors, generateRandomString, generateAccessToken, addNewCredentials, rand };
