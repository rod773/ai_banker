const User = require('../../../models/userModel');

const updateEmail = async (username, newEmail) => {
    try {
        if (!newEmail) throw new Error('New email is required');
        
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');
        
        const existingEmail = await User.findOne({ email: newEmail });
        if (existingEmail) throw new Error('Email already exists');

        user.email = newEmail;

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

module.exports = updateEmail;