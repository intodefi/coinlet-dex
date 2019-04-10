const request = require('request');
const Web3 = require('web3');
const config = require('./config.js');
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethRPC));
const SolidityFunction = require('web3');

module.exports = {
    weiToEth: function (wei, divisorIn) {
        const divisor = !divisorIn ? 1000000000000000000 : divisorIn;
        return (wei / divisor).toFixed(3);
    },
    ethToWei: function (eth, divisorIn) {
        const divisor = !divisorIn ? 1000000000000000000 : divisorIn;
        return parseFloat((eth * divisor).toPrecision(10));
    },

    roundToNearest: function (numToRound, numToRoundToIn) {
        const numToRoundTo = 1 / numToRoundToIn;
        return Math.round(numToRound * numToRoundTo) / numToRoundTo;
    },

    getURL: function (url, callback, options) {
        request.get(url, options, (err, httpResponse, body) => {
            if (err) {
                callback(err, undefined);
            } else {
                callback(undefined, body);
            }
        })
    },

    postURL: function (url, formData, callback) {
        request.post({url, form: formData}, (err, httpResponse, body) => {
            if (err) {
                callback(err, undefined);
            } else {
                callback(undefined, body);
            }
        })
    },

    call: function (web3In, contract, address, functionName, args, callback) {
        function proxy(retries) {

            const data = contract[functionName].getData.apply(null, args);
            let url = config.etherscanAPI`/api?module=proxy&action=eth_Call&to=${address}&data=${data}`;
            if (config.etherscanAPIKey) url += `&apikey=${config.etherscanAPIKey}`;
            getURL(url, (err, body) => {
                if (!err) {
                    try {
                        const result = JSON.parse(body);
                        const functionAbi = contract.abi.find(element => element.name === functionName);
                        const solidityFunction = new SolidityFunction(web3.Eth, functionAbi, address);
                        const resultUnpacked = solidityFunction.unpackOutput(result.result);
                        callback(undefined, resultUnpacked);
                    } catch (errJson) {
                        if (retries > 0) {
                            setTimeout(() => {
                                proxy(retries - 1)
                            }, 1000)
                        } else {
                            callback(err, undefined);
                        }
                    }
                } else {
                    callback(err, undefined);
                }
            })
        }

        try {
            const data = contract[functionName].getData.apply(null, args);
            web3In.eth.call({to: address, data}, (err, result) => {
                if (!err) {
                    const functionAbi = contract.abi.find(element => element.name === functionName);
                    const solidityFunction = new SolidityFunction(web3In.Eth, functionAbi, address);
                    try {
                        const resultUnpacked = solidityFunction.unpackOutput(result);
                        callback(undefined, resultUnpacked);
                    } catch (errJson) {
                        proxy(1);
                    }
                } else {
                    proxy(1);
                }
            })
        } catch (err) {
            proxy(1);
        }
    },
};