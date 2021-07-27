const express = require("express");
const cors = require('cors');
const http = require("http");

const app = express();

app.use(cors());

app.use(express.urlencoded());

app.post("/psp/:id/:operationId", (req, res) => {
    const cart = req.body.cart
    let jsonCart = null
    try {
        jsonCart = JSON.parse(cart)
        console.log(jsonCart)
    } catch (error) {
        console.error(error)
        return res.sendStatus(400)
    }

    console.log("SendStatus")

    res.sendStatus(201)

    /*setTimeout(() => {
        console.log("setTimeout")

        const optionsBackoffice = {
            host: "server_backoffice",
            path: "/operations/psp/" + req.params.id + "/" + req.params.operationId,
            method: "POST",
            port: 3000
        }

        http.request(optionsBackoffice, (res) => {
            console.log("coucou")
            res.on("end", () => console.log("Backoffice OK"))
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
            console.log("coucou2")
            res.on("end", () => console.log("Seller OK"))
        })
        request.write(body)
        request.end()

    }, 5000)*/
})

app.listen(process.env.PORT || 3000, () => console.log("server_psp listening"));
