const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const Payment = require("./models/payment.model.js");

require('dotenv').config();

const app = express();
const upload = multer();

const corsOptions1 = {
    origin: process.env.ORIGIN1,
    optionsSuccessStatus: 200
};

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(mongoSanitize());

app.use(bodyParser.json({ limit: '2kb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '1kb', extended: true }))
app.use(bodyParser.json());

app.post('/notification', upload.none(), async (req, res) => {
    try {
        console.log("IP: ", req.headers['x-real-ip'] || req.connection.remoteAddress);
        const payment = await Payment.create(req.body);
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.get('/notification', cors(corsOptions1), async (req, res) => {
    try {
        console.log(req.ip);
        const payments = await Payment.find({});
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.post('/notification/:OrderId', cors(corsOptions1), async (req, res) => {
    try {
        const secretKey = req.body.key;
        console.log(req.body);

        if (secretKey === process.env.SECRET_KEY) {

            const { OrderId } = req.params;
            const paymentById = await Payment.find({ MERCHANT_ORDER_ID: OrderId }); // []
            await Payment.deleteMany({ MERCHANT_ORDER_ID: OrderId });

            if (paymentById) {
                const totalmoneyQuantity = paymentById.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.AMOUNT;
                }, 0);

                const pearls = Math.round(totalmoneyQuantity / 20);

                const paymentAmount = {
                    code: 1,
                    playerId: paymentById[0].MERCHANT_ORDER_ID,
                    moneyQuantity: totalmoneyQuantity,
                    pearlsQuantity: pearls
                }

                res.status(200).json(paymentAmount);
            } else {
                res.status(500).json({
                    code: 0,
                    message: "user not found"
                })
            }
        } else {
            console.log("Wrong secret key");
            res.status(500).json({
                code: 0,
                message: "user not found"
            })
        }

    } catch (error) {
        res.status(500).json({ code: 0, message: error.message })
    }
});

const DB_URI = `mongodb+srv://solodovnikovtoni:${process.env.DB_PASSWORD}@worldpokemonapi.bladsvm.mongodb.net/worldpokemonpay?retryWrites=true&w=majority&appName=WorldpokemonAPI`

mongoose.connect(DB_URI)
    .then(() => {
        console.log('Connected DB');
        app.listen("8080", () => {
            console.log(`it's running on http://localhost:8080`);
        });
    })
    .catch(() => {
        console.log('Connection DB failed');
        console.log(DB_URI);
    });