const express = require('express');
const router = express.Router();
const server = require('../../controllers/server/server');

router.all('/login', server.login);
router.all('/loginout', server.loginout);

module.exports = router;