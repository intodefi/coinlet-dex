const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    address: String,
    blockNumber: Number,
    timeStamp: String,
    gasPrice: String,
    gasUsed: String,
    logIndex: Number,
    transactionHash: String,
    transactionIndex: Number,
    event: String,
    args: {},
    txLink: String,
});

module.exports = mongoose.model('Event', EventSchema);