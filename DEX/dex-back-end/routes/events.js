const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const utility = require('../utility');
const config = require('../config');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethRPC));

router.get('/:nonce/:lastblock', function (req, res, next) {
    Event.find(function (err, post) {
        let blockNumber = 0;
        utility.getURL(config.etherscanAPI + '/api?module=proxy&action=eth_blockNumber&apikey=DS7NDBYREV7ZPFX7VV7B8PTJ7ZPN1V432Y', (err, response) => {
            if (!err) {
                blockNumber = parseInt(JSON.parse(response).result);
                const item = {events: post, blockNumber: blockNumber};
                res.json(item);
            } else {
                throw  err;
            }
        });
    });
});

module.exports = router;