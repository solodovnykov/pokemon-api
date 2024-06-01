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
const Users = require("./models/users.model.js");

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

function getIP(req) {
    return req.headers['x-real-ip'] || req.connection.remoteAddress;
}

function checkIP(req, res, next) {
    const clientIP = getIP(req);
    const allowedIPs = process.env.ALLOWED_IPS.split(',').map(ip => ip.trim());

    if (!allowedIPs.includes(clientIP)) {
        return res.status(403).send('hacking attempt!');
    }

    console.log("This IP is supported!", clientIP);
    next();
}

app.post('/notification', upload.none(), checkIP, async (req, res) => {
    try {
        const {MERCHANT_ID, AMOUNT, intid, MERCHANT_ORDER_ID, P_EMAIL, P_PHONE, CUR_ID, commission, SIGN, payer_account} = req.body;

        const userExist = await Users.findOne({ user_id: req.body.MERCHANT_ORDER_ID });

        if(userExist) {
            const payment = await Payment.create(req.body);
            res.status(200).json(payment);
        } else {
            const amountMult = Number(AMOUNT) * 1.5;
            const payment = await Payment.create({MERCHANT_ID, AMOUNT: amountMult, intid, MERCHANT_ORDER_ID, P_EMAIL, P_PHONE, CUR_ID, commission, SIGN, payer_account});
            await Users.create({ user_id: req.body.MERCHANT_ORDER_ID });
            res.status(200).json(payment);
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.post('/payoknotification', async (req, res) => {
    try {
        await Payment.create({
            MERCHANT_ID: req.body.shop,
            AMOUNT: req.body.amount,
            MERCHANT_ORDER_ID: req.body.payment_id,
        });
        res.send("OK").status(200);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.get('/notification', cors(corsOptions1), async (req, res) => {
    try {
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