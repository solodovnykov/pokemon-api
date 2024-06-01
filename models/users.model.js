const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        default: 0,
    },

}, {
    timestamps: true,
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;