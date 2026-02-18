const User = require('../../../models/userModel');

const updatePreferences = async (username, preferences) => {
    try {
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        const validPreferences = [
            'riskAversion',
            'volatilityTolerance',
            'growthFocus',
            'cryptoExperience',
            'innovationTrust',
            'impactInterest',
            'diversification',
            'holdingPatience',
            'monitoringFrequency',
            'adviceOpenness'
        ];

        for (const field of validPreferences) {
            if (preferences[field] !== undefined) {
                const value = parseInt(preferences[field]);
                if (isNaN(value) || value < 1 || value > 10) {
                    throw new Error(`${field} must be a number between 1 and 10`);
                }
                user[field] = value;
            }
        }

        await user.save();

        return {
            username: user.username,
            email: user.email,
            riskAversion: user.riskAversion,
            volatilityTolerance: user.volatilityTolerance,
            growthFocus: user.growthFocus,
            cryptoExperience: user.cryptoExperience,
            innovationTrust: user.innovationTrust,
            impactInterest: user.impactInterest,
            diversification: user.diversification,
            holdingPatience: user.holdingPatience,
            monitoringFrequency: user.monitoringFrequency,
            adviceOpenness: user.adviceOpenness
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = updatePreferences;