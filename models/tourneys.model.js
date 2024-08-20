const mongoose = require('mongoose');

const TourneysSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
        default: '',
    },

    date: {
        type: String,
        required: true,
        default: '',
    },

    time: {
        type: String,
        required: true,
        default: '',
    },

    location: {
        type: String,
        required: true,
        default: '',
    },

    curator: {
        type: String,
        required: true,
        default: '',
    },

    pok_lvl: {
        type: String,
        required: true,
        default: '',
    },

    pok_count: {
        type: String,
        required: true,
        default: '',
    },

    inventory: {
        type: Boolean,
        required: true,
        default: false,
    },

    items: {
        type: Boolean,
        required: true,
        default: false,
    },

    replacements: {
        type: Boolean,
        required: true,
        default: false,
    },

    prizes: {
        type: [String],
        required: true,
    },

    other_text: {
        type: String,
        required: true,
        default: '',
    },

    train_id: {
        type: String,
        required: true,
        default: '',
    },

    train_name: {
        type: String,
        required: true,
        default: '',
    },


}, {
    timestamps: true,
});

const Tourneys = mongoose.model("Tourneys", TourneysSchema);

module.exports = Tourneys;