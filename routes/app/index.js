const express = require('express');
const router = express.Router();
const appRoute = require('./app');

router.use('/app', appRoute);

module.exports = router;