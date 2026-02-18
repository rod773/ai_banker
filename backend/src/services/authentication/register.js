const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');

const register = async (userData) => {
    try {
        const existingUser = await User.findOne({ 
            $or: [
                { username: userData.username },
                { email: userData.email }
            ]
        });
        if (existingUser) {
            throw new Error(
                existingUser.username === userData.username 
                    ? 'Username already exists' 
                    : 'Email already exists'
            );
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = new User({
            username: userData.username,
            password: hashedPassword,
            email: userData.email,
            riskAversion: userData.riskAversion || 5,
            volatilityTolerance: userData.volatilityTolerance || 5,
            growthFocus: userData.growthFocus || 5,
            cryptoExperience: userData.cryptoExperience || 5,
            innovationTrust: userData.innovationTrust || 5,
            impactInterest: userData.impactInterest || 5,
            diversification: userData.diversification || 5,
            holdingPatience: userData.holdingPatience || 5,
            monitoringFrequency: userData.monitoringFrequency || 5,
            adviceOpenness: userData.adviceOpenness || 5
        });

        await newUser.save();

        return {
            username: userData.username,
            email: userData.email,
            riskAversion: newUser.riskAversion,
            volatilityTolerance: newUser.volatilityTolerance,
            growthFocus: newUser.growthFocus,
            cryptoExperience: newUser.cryptoExperience,
            innovationTrust: newUser.innovationTrust,
            impactInterest: newUser.impactInterest,
            diversification: newUser.diversification,
            holdingPatience: newUser.holdingPatience,
            monitoringFrequency: newUser.monitoringFrequency,
            adviceOpenness: newUser.adviceOpenness
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = register;