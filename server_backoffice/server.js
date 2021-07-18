const express = require("express");
const UserRouter = require("./routes/UserRouter");
const SecurityRouter = require("./routes/SecurityRouter");
const SellerRouter = require("./routes/SellerRouter");
const CredentialsRouter = require("./routes/CredentialsRouter");
const TransactionRouter = require("./routes/TransactionRouter");
const mustacheExpress = require("mustache-express");
const migrate = require("./lib/sequalizeloader");
const cors = require('cors');
const { Transaction } = require("sequelize/types");

migrate().then(()=>{
    console.log("Exportation terminée");
})
const app = express();
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use("/users", UserRouter);
app.use("/sellers", SellerRouter);
app.use("/credentials", CredentialsRouter);
app.use("/auth", SecurityRouter);
app.use("/transaction", TransactionRouter);

app.listen(process.env.PORT || 3000, () => console.log("server_backoffice listening"));
