const express = require("express");
const cors = require('cors');
const http = require("http");

const app = express();

app.use(cors());

app.use(express.urlencoded());

app.post("/psp/:id/:operationId", (req, res) => {
    const { cart } = req.body;

    try {
        JSON.parse(cart)
    } catch (error) {
        console.error(error)
        return res.sendStatus(400)
    }

    res.sendStatus(201)
    setTimeout(() => {

        const optionsBackoffice = {
            host: "server_backoffice",
            path: "/operations/psp/" + req.params.id + "/" + req.params.operationId,
            method: "POST",
            port: 3000
        }

        http.request(optionsBackoffice, (res) => {
            res.on('data', () => {});
            res.on("end", () => console.log("Notif sent to Backoffice!"));
        }).end()

        const body = "cart=" + encodeURIComponent(cart)

        const optionsSeller = {
            host: "server_seller",
            path: "/psp/",
            method: "POST",
            port: 3000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Content-length': Buffer.byteLength(body)
            }
        }

        const request = http.request(optionsSeller, (res) => {
            res.on('data', () => {});
            res.on("end", () => console.log("Notif sent to Seller"));
        })
        request.write(body)
        request.end()

    }, 10000)
})

app.listen(process.env.PORT || 3000, () => console.log("server_psp listening"));
