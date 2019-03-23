const express = require('express');
const router = express.Router();
const app = require('../../controllers/app/app');

router.get('/list/:restaurantId', app.restaurantlist);

module.exports = router;