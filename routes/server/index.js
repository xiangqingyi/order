const express = require('express');
const router = express.Router();
const serverRoute = require('./server');

router.use('/server', serverRoute);

module.exports = router;