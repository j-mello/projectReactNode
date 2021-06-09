const express = require("express");
const UserRouter = require("./routes/UserRouter");
const mustacheExpress = require("mustache-express");
const migrate = require("./sequalizeloader");

migrate().then(()=>{
    console.log("Exportation terminée");
})
const app = express();
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded());

app.use("/users", UserRouter);

app.listen(process.env.PORT || 3000, () => console.log("server listening"));