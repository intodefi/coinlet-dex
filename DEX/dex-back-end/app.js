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
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const web3 = new Web3(config.ethRPC);
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}))
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

mongoose.Promise = global.Promise;

//configure morgan to log every api call on server
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[clf]'));

// const exchangeContractAbi = web3.eth.contract(config.dExContractABI);
// const exchangeContract = exchangeContractAbi.at(config.contractDExAddrs[0].addr);
const exchangeContract = new web3.eth.Contract(config.dExContractABI, config.contractDExAddrs[0].addr);
const exchangeContractEvents = exchangeContract.events;
//Mongoose Setup
// =============================================================================
// Connect To Database
mongoose.connect(config.dbPath)
    .then(() => {
    })
    .catch((err) => {
        console.log('Database error: ' + err);
        mongoose.connect(config.dbPath);
    })
    ;

// On Connection
mongoose.connection
    .on('connected', () => {
        console.log('Database connected at ' + config.dbPath);
    });

// On Error
mongoose.connection
    .on('error', (err) => {
        console.log('Database error: ' + err);
    });

const Order_event = exchangeContractEvents.Order();
const Deposit_event = exchangeContractEvents.Deposit();
const Withdraw_event = exchangeContractEvents.Withdraw();
const Cancel_event = exchangeContractEvents.Cancel();
const Trade_event = exchangeContractEvents.Trade();
Deposit_event.on('data', makeItem);
Withdraw_event.on('data', makeItem);
Cancel_event.on('data', makeItem);
Trade_event.on('data', makeItem);
Order_event.on('data', makeItem);

// we need an events route
function makeItem(res) {
    let item = {};
    utility.getURL(config.etherscanAPI + '/api?module=proxy&action=eth_getTransactionByHash&txhash=' + res.transactionHash + '&apikey=KF9ADFTHP4WJF1GV3WHJZCTFZIN5XZUXG1', (err, response) => {
        if (!err) {
            const responseFromURL = JSON.parse(response);
            item = {
                address: res.address,
                blockNumber: res.blockNumber,
                timeStamp: Date.now().toString(16),
                gasPrice: responseFromURL.result.gasPrice,
                gasUsed: responseFromURL.result.gas,
                logIndex: res.logIndex,
                transactionHash: res.transactionHash,
                transactionIndex: res.transactionIndex,
                event: res.event,
                args: res.returnValues,
                txLink: config.etherscanUrl + "/tx/" + res.transactionHash,
            };
            console.log('ITEM = ', item);
            if (item.event === 'Trade') {
                const query = {
                    $and: [
                        { "order.tokenGet": item.args.tokenGet },
                        { "order.tokenGive": item.args.tokenGive },
                        { "order.amountGet": item.args.amountGet },
                        { "order.amountGive": item.args.amountGive },
                    ]
                };
                // in args we have tokenGet , tokenGive ,amount GEt , amount give   (get address , give address are of no use to us )
                Order.update(query, { $set: { "amountFilled": "true" } }, { multi: true }, function (err, post) {
                    if (err) throw err;
                    console.log("this is post from makeItem" + post);
                });
            }
            console.log("from make Item the item formed is " + JSON.stringify(item));
            Event.create(item, function (err, post) {
                if (err) throw err;
                console.log(" event posted " + post);
            });
        }
    });
}


// ROUTES FOR OUR API
// =============================================================================
// create our router
const router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
    // do logging
    next();
});

// import our routers
// ----------------------------------------------------

//admin routes
router.use('/admin', require('./routes/admin'));
// get only route returns ticker
router.use('/returnticker', require('./routes/returnticker'));
// This route is get only , returns all pending orders
router.use('/orders', require('./routes/Orders'));
// this route is get only
router.use('/events', require('./routes/events'));
// This is post only route
router.use('/message', require('./routes/message'));
router.use('/toporders', require('./routes/toporders'));

// register our routers
// -------------------------------
app.use('/', router);


// START THE SERVER
// =============================================================================
app.listen(process.env.PORT || config.port, (err) => {
    if (err)
        console.log(err);
    console.log('Server running at port:' + config.port);
});