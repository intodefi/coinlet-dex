const express = require('express');
const router = express.Router();
const Event = require('../models/Event.js');
const config = require('../config.js');
const BigNumber = require('bignumber.js');
const utility = require('../utility');

router.get('/', function (req, res, next) {
    // get trade events from events document
    const trades = [];
    let events = [];
    Event.find({"event": "Trade"}, function (err, post) {
        console.log("TICKER INSIDE");
        console.log("POST = ", post)
        events = post;
        events.forEach((event) => {
            const amountGive = new BigNumber(event.args.amountGive);
            const amountGet = new BigNumber(event.args.amountGet);

            //console.log(typeof event.timeStamp+event.timeStamp+' '+parseInt(event.timeStamp,16));
            if (amountGive > 0 && amountGet > 0) {
                // don't show trades involving 0 amounts
                // sell
                trades.push({
                    token: getToken(event.args.tokenGet),
                    base: getToken(event.args.tokenGive),
                    amount: amountGet,
                    price: amountGive
                        .div(amountGet)
                        .mul(getDivisor(event.args.tokenGet))
                        .div(getDivisor(event.args.tokenGive)),
                    id: (event.blockNumber * 1000) + event.transactionIndex,
                    blockNumber: event.blockNumber,
                    date: parseInt(event.timeStamp, 16),
                    buyer: event.args.get,
                    seller: event.args.give,
                });
                // buy
                trades.push({
                    token: getToken(event.args.tokenGive),
                    base: getToken(event.args.tokenGet),
                    amount: amountGive,
                    price: amountGet
                        .div(amountGive)
                        .mul(getDivisor(event.args.tokenGive))
                        .div(getDivisor(event.args.tokenGet)),
                    id: (event.blockNumber * 1000) + event.transactionIndex,
                    blockNumber: event.blockNumber,
                    date: parseInt(event.timeStamp, 16),
                    buyer: event.args.give,
                    seller: event.args.get,
                });
            }
        });
        trades.sort((a, b) => b.id - a.id);
        const tickers = {};
        const firstOldPrices = {};

        trades.sort((a, b) => a.blockNumber - b.blockNumber);
        trades.forEach((trade) => {
            if (trade.token && trade.base && trade.base.name === 'ETH') {
                const pair = `${trade.base.name}_${trade.token.name}`;
                if (!tickers[pair]) {
                    tickers[pair] = {last: undefined, percentChange: 0, baseVolume: 0, quoteVolume: 0};
                }
                const tradeTime = trade.date;
                const price = Number(trade.price);
                tickers[pair].last = price;
                if (!firstOldPrices[pair]) firstOldPrices[pair] = price;
                if (Date.now() - tradeTime < 86400 * 1000) {
                    const quoteVolume = Number(
                        utility.weiToEth(Math.abs(trade.amount), getDivisor(trade.token)));
                    const baseVolume = Number(
                        utility.weiToEth(Math.abs(trade.amount * trade.price),
                            getDivisor(trade.token)));
                    tickers[pair].quoteVolume += quoteVolume;
                    tickers[pair].baseVolume += baseVolume;
                    tickers[pair].percentChange = (price - firstOldPrices[pair]) / firstOldPrices[pair];
                } else {
                    firstOldPrices[pair] = price;
                }
            }
        });
        console.log(' the result is ' + JSON.stringify(tickers));
        res.send(tickers);
    });
});

function getDivisor(tokenOrAddress) {
    let result = 1000000000000000000;
    const token = getToken(tokenOrAddress);
    //console.log("from get divisor , token from getToekn"+token);
    if (token && token.decimals >= 0) {
        result = Math.pow(10, token.decimals); // eslint-disable-line no-restricted-properties
    }
    return new BigNumber(result);
}

function getToken(token_address) {
    let result;
    console.log("the token address is " + token_address);
    const matchingTokens = config.tokens.filter(
        x => x.addr === token_address);
    const expectedKeys = JSON.stringify(['addr', 'decimals', 'name',]);

    if (matchingTokens.length > 0) {
        result = matchingTokens[0];
    } else if (token_address.addr && JSON.stringify(Object.keys(token_address).sort()) === expectedKeys) {
        result = token_address.addr;
    } else {
        console.log('not found' + JSON.stringify(token_address));
    }
    console.log('the result is ' + result);
    return result;
}

//export this router to use in our index.js
module.exports = router;