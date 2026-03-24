const express = require('express');
const router = express.Router();
const {
    loginController,
    registerController,
    updateUserController,
    deleteUserController,
    updateEmailController,
    updatePasswordController,
    updatePreferencesController,
    walletNonceController,
    walletVerifyController,
} = require('../controllers/authenticationController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/login', loginController);
router.post('/register', registerController);
router.patch('/update', verifyToken, updateUserController);
router.patch('/updateEmail', verifyToken, updateEmailController);
router.patch('/updatePassword', verifyToken, updatePasswordController);
router.patch('/updatePreferences', verifyToken, updatePreferencesController);
router.delete('/delete', verifyToken, deleteUserController);

// Wallet authentication (Sign-In with Ethereum / EIP-4361)
router.get('/wallet/nonce', walletNonceController);
router.post('/wallet/verify', walletVerifyController);

module.exports = router;