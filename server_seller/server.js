const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());


app.post('/psp', (req, res) => {
    console.log(req.body);
})
