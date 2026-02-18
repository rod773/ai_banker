const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, reportController);

module.exports = router;