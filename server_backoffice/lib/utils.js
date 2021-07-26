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

const generateMongoTransaction = (transaction, operations = [], transactionsHistories = []) => ({
    ...transaction.dataValues,
    cart: JSON.parse(transaction.dataValues.cart),
    Operations: [
        ...transaction.dataValues.Operations.map(operation =>
            ({
                ...operation.dataValues,
                OperationHistories: operation.dataValues.OperationHistories.map(operationHistory =>
                    operationHistory.dataValues
                )
            })
        ),
        ...operations
    ],
    TransactionHistories: [
        ...transaction.dataValues.TransactionHistories.map(transactionHistory =>
            transactionHistory.dataValues
        ),
        ...transactionsHistories
    ],
    Seller: transaction.dataValues.Seller.dataValues
})

const totalPriceCart = (carts) => Object.keys(carts).reduce((acc, SellerId)=>({
    ...acc, ...carts[SellerId].reduce((acc, product) => ({
        ...acc, [product.currency]: acc[product.currency] ? acc[product.currency] + product.price * product.quantity : product.price * product.quantity
    }), acc)
})
 ,{}   
)

const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

const isNumber = (n) => (typeof(n) == "number" || ( typeof(n) == "string" && parseFloat(n).toString() === n && n !== "NaN")) && parseFloat(n);

const round = (n,p) => Math.floor(n*10**p)/10**p;

module.exports = { sendErrors, generateMongoTransaction, generateRandomString, generateAccessToken, addNewCredentials, totalPriceCart, rand, isNumber, round };
