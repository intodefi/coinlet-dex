/**
 *
 * for getting all orders for a particular token pair
 */
const express = require('express');
const router = express.Router();
const Order = require('../models/Order.js');
const utility = require('../utility');
const config = require('../config.js');
/* GET all orders for the given pair */
router.get('/:nonce/:tokena/:tokenb', function (req, res, next) {
    const query = {
        $and: [{
            $or: [
                {$and: [{"order.tokenGet": req.params.tokena}, {"order.tokenGive": req.params.tokenb}]},
                {$and: [{"order.tokenGet": req.params.tokenb}, {"order.tokenGive": req.params.tokena}]}
            ]
        },
            {
                "amountFilled": {$ne: "true"}
            }]
    };
    Order.find(query, function (err, post) {
        if (err) throw err;
        const result = [];
        /*forEach(x in post)
        {
            result.push()
        }*/
        //todo not sure which block number to send from here , sending current blockNumber
        //todo change to api for mainnet
        let blockNumber = 0;
        utility.getURL(config.etherscanAPI + '/api?module=proxy&action=eth_blockNumber&apikey=KF9ADFTHP4WJF1GV3WHJZCTFZIN5XZUXG1', (err, response) => {
            if (!err) {
                blockNumber = parseInt(JSON.parse(response).result);
                const item = {orders: post, blockNumber: blockNumber};
                res.json(item);
            }
            else {
                throw  err;
            }
        });
    })
});

module.exports = router;