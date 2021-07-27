const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.urlencoded());


app.post('/psp', (req, res) => {
    let {cart} = req.body;

    try {
        cart = JSON.parse(cart)
    } catch (e) {
        console.log("Invalid cart!");
        return;
    }

    console.log("Panier validé! => ");
    console.log(cart);
})

app.listen(process.env.PORT || 3000, () => console.log("server_seller listening"));