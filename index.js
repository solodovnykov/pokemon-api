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

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(mongoSanitize());

app.use(bodyParser.json({ limit: '2kb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '1kb', extended: true }))
app.use(bodyParser.json());



app.get('/test', (req, res) => {
    res.status(200).send("Test")
})


app.post('/notification', upload.none(), async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.get('/notification', async (req, res) => {
    try {
        const payments = await Payment.find({});
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.get('/notification/:OrderId', async (req, res) => {
    try {
        const { OrderId } = req.params;
        const paymentById = await Payment.find({ MERCHANT_ORDER_ID: OrderId }); // []

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