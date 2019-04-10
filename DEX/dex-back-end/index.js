const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Web3 = require('web3');
const Event = require('./models/Event.js');
const utility = require('./utility');
const Order = require('./models/Order.js');
const config = require('./config');
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethRPC));

    // "web3": "^0.19.1"
const exchangeContract = new web3.eth.Contract(config.dExContractABI, config.contractDExAddrs[0].addr);
exchangeContract.events.allEvents().on('data', console.log)