const getUserPreferencesByUsername = require('../services/user/getUserPreferencesByUsername');
const {
  badRequestJsonResponse,
  notFoundJsonResponse,
  unauthorizedJsonResponse,
  internalErrorJsonResponse,
  successJsonResponse,
} = require('../utils/jsonResponses/jsonResponses');

async function getUserPreferencesController(req, res) {
    try {
        const { username } = req.params;

        if (!username) return res.json(badRequestJsonResponse('Username is required'));

        const preferences = await getUserPreferencesByUsername(username);

        return res.json(successJsonResponse(preferences));

    } catch (error) {
        return res.json(internalErrorJsonResponse(error.message));
    }
}

module.exports = getUserPreferencesController;