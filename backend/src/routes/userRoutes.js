const express = require('express');
const router = express.Router();
const json_bundle = require('json-dec');
const getUserPreferencesController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/preferences', verifyToken, getUserPreferencesController);

module.exports = router;