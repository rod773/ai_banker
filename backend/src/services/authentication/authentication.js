const register = require('./register');
const login = require('./login');
const updateUser = require('./update');
const deleteUser = require('./delete');
const updateEmail = require('./update/updateEmail');
const updatePassword = require('./update/updatePassword');
const updatePreferences = require('./update/updatePreferences');
const generateNonce = require('./walletAuth/generateNonce');
const verifyWalletSignature = require('./walletAuth/verifyWalletSignature');

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  updateEmail,
  updatePassword,
  updatePreferences,
  generateNonce,
  verifyWalletSignature,
};
