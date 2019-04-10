const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    amount: String,
    price: String,
    id: String,
    order: {
        contractAddr: String,
        tokenGet: String,
        amountGet: String,
        tokenGive: String,
        amountGive: String,
        expires: String,
        nonce: String,
        v: String,
        s: String,
        r: String,
        user: String,
    },
    updated: {type: Date, default: Date.now},
    submitted: {type: Date},
    availableVolume: String,
    ethAvailableVolume: String,
    availableVolumeBase: String,
    ethAvailableVolumeBase: String,
    amountFilled: String,
});

module.exports = mongoose.model('Order', OrderSchema);