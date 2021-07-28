const express = require("express");
const SecurityRouter = require("./routes/SecurityRouter");
const SellerRouter = require("./routes/SellerRouter");
const CredentialsRouter = require("./routes/CredentialsRouter");
const ConversionRateRouter = require("./routes/ConversionRateRouter");
const TransactionRouter = require("./routes/TransactionRouter");
const OperationRouter = require("./routes/OperationRouter");
const { twig } = require("twig");
const { migrate } = require("./lib/sequalizeloader");
const { totalPriceCart } = require("./lib/utils");
const cors = require('cors');

migrate().then(()=>{
    console.log("Exportation terminée");
})
const app = express();

app.set('view engine', 'twig');
app.set("views", __dirname + "/views");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use("/sellers", SellerRouter);
app.use("/credentials", CredentialsRouter);
app.use("/auth", SecurityRouter);
app.use("/transactions", TransactionRouter);
app.use("/conversionRate", ConversionRateRouter);
app.use("/operations", OperationRouter);

app.get("/payment", (req, res) => {
    let jsonCarts =  {};
    try {
        jsonCarts =  JSON.parse(req.query.carts);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
    res.render('payment.html.twig', {
        carts: jsonCarts, 
        redirectUrl : req.query.redirectUrl,
        totalPriceByCurrency : totalPriceCart(jsonCarts)
    });
})

app.listen(process.env.PORT || 3000, () => console.log("server_backoffice listening"));
