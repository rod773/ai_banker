const register = require('./register');
const login = require('./login');
const updateUser = require('./update');
const deleteUser = require('./delete');
const updateEmail = require('./update/updateEmail');
const updatePassword = require('./update/updatePassword');
const updatePreferences = require('./update/updatePreferences');

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  updateEmail,
  updatePassword,
  updatePreferences
};
