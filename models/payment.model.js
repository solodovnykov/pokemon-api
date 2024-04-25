const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
    MERCHANT_ID: {
        type: Number,
        required: true,
        default: 0,
    },

    AMOUNT: {
        type: Number,
        required: true,
        default: 0,
    },

    intid: {
        type: Number,
        required: true,
        default: 0,
    },

    MERCHANT_ORDER_ID: {
        type: Number,
        required: true,
        default: 0,
    },

    P_EMAIL: {
        type: String,
    },

    P_PHONE: {
        type: String,
    },

    CUR_ID: {
        type: Number,
        default: 0,
    },

    commission: {
        type: Number,
        default: 0,
    },

    SIGN: {
        type: String,
    },

    payer_account: {
        type: String,
    },

}, {
    timestamps: true,
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;