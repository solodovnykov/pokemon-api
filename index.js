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
        const paymentById = await Payment.findOne({ MERCHANT_ORDER_ID: OrderId });

        const pearls = Math.round(paymentById.AMOUNT / 20);

        const paymentAmount = {
            playerId: paymentById.MERCHANT_ORDER_ID,
            moneyQuantity: paymentById.AMOUNT,
            pearlsQuantity: pearls
        }

        res.status(200).json(paymentAmount);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});


mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('Connected DB');
        app.listen(process.env.PORT, () => {
            console.log(`it's running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch(() => {
        console.log('Connection DB failed')
    });