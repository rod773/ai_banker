const authenticationService = require('../services/authentication/authentication');
const {
  badRequestJsonResponse,
  notFoundJsonResponse,
  unauthorizedJsonResponse,
  internalErrorJsonResponse,
  successJsonResponse,
} = require('../utils/jsonResponses/jsonResponses');

/**
 * Authenticates user and generates JWT token
 * Assumes req.body contains valid username and password strings
 */
const loginController = async (req, res) => {
  try {
    const token = await authenticationService.login(req.body.username, req.body.password);

    return res.json(successJsonResponse(token));
  } catch (error) {
    if (error.message === 'Invalid credentials') return res.json(unauthorizedJsonResponse(error.message));
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * Creates new user account with investment profile
 * Assumes req.body contains all required user fields and preference ratings (1-10)
 */
const registerController = async (req, res) => {
  try {
    const userData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      riskAversion: req.body.riskAversion,
      volatilityTolerance: req.body.volatilityTolerance,
      growthFocus: req.body.growthFocus,
      cryptoExperience: req.body.cryptoExperience,
      innovationTrust: req.body.innovationTrust,
      impactInterest: req.body.impactInterest,
      diversification: req.body.diversification,
      holdingPatience: req.body.holdingPatience,
      monitoringFrequency: req.body.monitoringFrequency,
      adviceOpenness: req.body.adviceOpenness
    };
    const user = await authenticationService.register(userData);

    return res.json(successJsonResponse(user));
  } catch (error) {
    if (error.message === 'User already exists') return res.json(badRequestJsonResponse(error.message));
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * Removes user account and associated data
 * Assumes req.body contains valid username string
 */
const deleteUserController = async (req, res) => {
  try {
    const user = await authenticationService.deleteUser(req.body);

    return res.json(successJsonResponse(user));
  } catch (error) {
    if (error.message === 'User not found') return res.json(notFoundJsonResponse(error.message));
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * Updates all user's information
 * Assumes req.body contains username and at least one updatable field
 */
const updateUserController = async (req, res) => {
  try {
    const user = await authenticationService.updateUser(req.body);

    return res.json(successJsonResponse(user));
  } catch (error) {
    if (error.message === 'User not found') return res.json(notFoundJsonResponse(error.message));
    else return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * Updates user's email address
 * Assumes req.body contains username and valid newEmail string
 */
const updateEmailController = async (req, res) => {
  try {
    const { username, newEmail } = req.body;
    
    if (!username || !newEmail) {
      return res.json(badRequestJsonResponse('Username and new email are required'));
    }

    const user = await authenticationService.updateEmail(username, newEmail);
    return res.json(successJsonResponse(user));
  } catch (error) {
    if (error.message === 'User not found') {
      return res.json(notFoundJsonResponse(error.message));
    }
    else if (error.message === 'Email already exists') {
      return res.json(badRequestJsonResponse(error.message));
    }
    return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * Updates user's password with new hashed value
 * Assumes req.body contains username and newPassword meeting security requirements
 */
const updatePasswordController = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.json(badRequestJsonResponse('Username and new password are required'));
    }

    const user = await authenticationService.updatePassword(username, newPassword);
    
    return res.json(successJsonResponse(user));
  } catch (error) {
    if (error.message === 'User not found') {
      return res.json(notFoundJsonResponse(error.message));
    }
    return res.json(internalErrorJsonResponse(error.message));
  }
};

/**
 * Updates user's investment preferences
 * Assumes req.body contains username and preference values between 1-10
 */
const updatePreferencesController = async (req, res) => {
  try {
    const { username, ...preferences } = req.body;
    if (!username) {
      return res.json(badRequestJsonResponse('Username is required'));
    }

    const user = await authenticationService.updatePreferences(username, preferences);
    return res.json(successJsonResponse(user));
  } catch (error) {
    if (error.message === 'User not found') {
      return res.json(notFoundJsonResponse(error.message));
    }
    if (error.message.includes('must be a number between 1 and 10')) {
      return res.json(badRequestJsonResponse(error.message));
    }
    return res.json(internalErrorJsonResponse(error.message));
  }
};



module.exports = {
  loginController,
  registerController,
  updateUserController,
  deleteUserController,
  updateEmailController,
  updatePasswordController,
  updatePreferencesController
};