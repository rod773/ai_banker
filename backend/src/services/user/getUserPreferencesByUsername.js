const User = require('../../models/userModel');

async function getUserPreferencesByUsername(username) {
    try {
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');
        return {
            riskAversion: user.riskAversion,
            volatilityTolerance: user.volatilityTolerance,
            growthFocus: user.growthFocus,
            cryptoExperience: user.cryptoExperience,
            innovationTrust: user.innovationTrust,
            impactInterest: user.impactInterest,
            diversification: user.diversification,
            holdingPatience: user.holdingPatience,
            monitoringFrequency: user.monitoringFrequency,
            adviceOpenness: user.adviceOpenness,
        };
    } catch (error) {
        throw new Error('Failed to fetch user details: ' + error.message);
    }
}

module.exports = getUserPreferencesByUsername;
