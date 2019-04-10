const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/9c53Bai0EYh4fbE7elEE'));
const request = require('request');
const async = require('async');
const BigNumber = require('bignumber.js');
const sha256 = require('js-sha256').sha256;
const decimal = 0;
const availableVolumeBase = 0;
const ethAvailableVolumeBase = 0;
const availableVolume = 0;
const ethAvailableVolume = 0;
const price = 0;
const amount = 0;
const config = require('../config.js');
const ABI = [
    {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "success", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "totalSupply", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
        "name": "_amount",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{"name": "success", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "success", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "remaining", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "fallback"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {
        "indexed": true,
        "name": "_to",
        "type": "address"
    }, {"indexed": false, "name": "_value", "type": "uint256"}],
    "name": "Transfer",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
        "indexed": true,
        "name": "_spender",
        "type": "address"
    }, {"indexed": false, "name": "_value", "type": "uint256"}],
    "name": "Approval",
    "type": "event"
}];
const utility = require('../utility');
router.post('/', function (req, res, next) {
    /*  request.get(config.etherscanAPI + '/api?module=contract&action=getabi&address='+req.body.contractAddr,function (err,data) {
        //const contractABI = "";
        //console.log(JSON.parse(data.body).result);
        //const ABI=JSON.parse(data.body).result;
        //console.log(ABI.toArray());
    });*/
    formOrder(req, res);

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

function formOrder(req, res) {
    const id = sha256(Math.random().toString());
    console.log("this is req" + JSON.stringify(req.body));
    const request = JSON.parse(req.body.message);
    const buyOrder = {
        amount: request.amountGet,
        price: new BigNumber(parseInt(request.amountGive))
            .div(parseInt(request.amountGive))
            .mul(getDivisor(request.tokenGet))
            .div(getDivisor(request.tokenGive)),
        id: `${id}_buy`,
        order: {
            contractAddr: request.contractAddr,
            tokenGet: request.tokenGet,
            amountGet: request.amountGet,
            tokenGive: request.tokenGive,
            amountGive: request.amountGive,
            expires: request.expires,
            nonce: request.nonce,
            v: request.v.toString(),
            s: request.s,
            r: request.r,
            user: request.user,
        },
        amountFilled: "0",
    };
    const sellOrder = {
        amount: -request.amountGive,
        price: new BigNumber(request.amountGet)
            .div(request.amountGive)
            .mul(getDivisor(request.tokenGive))
            .div(getDivisor(request.tokenGet)),
        id: `${id}_sell`,
        amountFilled: "0",
        order: {
            contractAddr: request.contractAddr,
            tokenGet: request.tokenGet,
            amountGet: request.amountGet,
            tokenGive: request.tokenGive,
            amountGive: request.amountGive,
            expires: request.expires,
            nonce: request.nonce,
            v: request.v.toString(),
            s: request.s,
            r: request.r,
            user: request.user,
        },

    };
    let newOrder = getOrderParams(buyOrder, 100);
    const Order = require('../models/Order');
    /*
        console.log('Buy order sent from FormOrder');
    */
    Order.create(newOrder, function (err, post) {
        if (err) throw err;
        console.log("buy order sent is " + post)
    });
    newOrder = getOrderParams(sellOrder, 100);
    /*
        console.log('Sell order sent from FormOrder');
    */
    Order.create(newOrder, function (err, post) {
        if (err) throw err;
        console.log("sell order sent is " + post);

    });

    res.json("success");


}

function getOrderParams(orderIn, availableVolume) {
    const order = orderIn;
    availableVolume = new BigNumber(order.order.amountGet);
    //get Available Volume from web3
    /*
        console.log('inside getOrderParams with input order as'+order);
    */
    if (order.amount >= 0) {

        order.price = new BigNumber(order.order.amountGive)
            .div(new BigNumber(order.order.amountGet))
            .mul(getDivisor(order.order.tokenGet))
            .div(getDivisor(order.order.tokenGive));
        // difference
        order.availableVolume = availableVolume;
        order.ethAvailableVolume = weiToEth(
            Math.abs(order.availableVolume),
            getDivisor(order.order.tokenGet));
        //difference
        order.availableVolumeBase = Math.abs(availableVolume
            .mul(order.price)
            .mul(getDivisor(order.order.tokenGive))
            .div(getDivisor(order.order.tokenGet)));
        order.ethAvailableVolumeBase = utility.weiToEth(order.availableVolumeBase,
            getDivisor(order.order.tokenGive));
    }
    else {

        order.price = new BigNumber(order.order.amountGet)
            .div(new BigNumber(order.order.amountGive))
            .mul(getDivisor(order.order.tokenGive))
            .div(getDivisor(order.order.tokenGet));
        //difference
        order.availableVolume = availableVolume
            .div(order.price)
            .mul(getDivisor(order.order.tokenGive))
            .div(getDivisor(order.order.tokenGet));
        //order.availableVolume=availableVolume;
        order.ethAvailableVolume = utility.weiToEth(
            Math.abs(order.availableVolume),
            getDivisor(order.order.tokenGive));
        //difference
        order.availableVolumeBase = Math.abs(availableVolume);
        order.ethAvailableVolumeBase = utility.weiToEth(
            order.availableVolumeBase,
            getDivisor(order.order.tokenGet));
    }
    return order;

}

function getAvailableVolume() {


}

function weiToEth(wei, divisorIn) {
    const divisor = !divisorIn ? 1000000000000000000 : divisorIn;
    return (wei / divisor).toFixed(3);
}

function getToken(token_address) {
    let result;
    const matchingTokens = config.tokens.filter(
        x => x.addr === token_address);
    const expectedKeys = JSON.stringify([
        'addr',
        'decimals',
        'name',
    ]);
    //matchingTokens++;
    //console.log('matching tokens'+matchingTokens);
    //console.log('matching token found '+matchingTokens[0]+' '+matchingTokens.length+' '+matchingTokens);
    if (matchingTokens.length > 0) {
        result = matchingTokens[0];
    } /*else if (token_address.addr && JSON.stringify(Object.keys(token_address).sort()) === expectedKeys) {
        console.log("dude it went into else , means given token was not found , checkout line 198");
        result = token_address;
    }*/
    else {
        console.log('dude it went into else , it wasnt supposed to , i know ! check line 202');
    }
    return result;
}

module.exports = router;
