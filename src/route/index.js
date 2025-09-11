const express = require('express');
const router = express.Router();
const customerRoute = require('./customer.route');

router.use('/customer', customerRoute);

module.exports = router;