const mongoose = require('mongoose');

const ReturnTickerSchema = new mongoose.Schema({
    last: Number,
    percentChange: Number,
    baseVolume: Number,
    quoteVolume: Number,
});

module.exports = mongoose.model('ReturnTicker', ReturnTickerSchema);