const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());


app.post('/psp', (req, res) => {
    console.log(req.body);
})

app.listen(process.env.PORT || 3000, () => console.log("server_seller listening"));