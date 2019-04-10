const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth.middleware');
const config = require('../config');
const layout = 'auth.layout.hbs';
router.get('/orders', auth.isUserLoggedIn, async (req, res, next) => {
    let orders = await Order.find().sort({ created_at: -1 }).limit(100);
    res.render('orders', { orders, layout })
});
router.get('/login', async (req, res, next) => {
    res.render('login');
});
router.get('/logout', async (req, res, next) => {
    req.session.loggedIn = false;
    res.redirect('/admin/login');
});
router.post('/login', async (req, res, next) => {
    if (req.body.email === config.SITE_ADMIN_MAIL && req.body.password === config.SITE_ADMIN_PASSWORD) req.session.loggedIn = true;
    res.redirect('/admin/orders')
});

module.exports = router;