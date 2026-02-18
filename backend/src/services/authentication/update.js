const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');

const updateUser = async (username, updatedData) => {
    try {
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        if (updatedData.newUsername) {
            const existingUser = await User.findOne({ username: updatedData.newUsername });
            if (existingUser) throw new Error('Username already exists');
            user.username = updatedData.newUsername;
        }

        if (updatedData.newPassword) {
            const hashedPassword = await bcrypt.hash(updatedData.newPassword, 10);
            user.password = hashedPassword;
        }

        if (updatedData.email) {
            const existingEmail = await User.findOne({ email: updatedData.email });
            if (existingEmail) throw new Error('Email already exists');
            user.email = updatedData.email;
        }

        // Update profile parameters if provided
        const profileFields = [
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

        profileFields.forEach(field => {
            if (updatedData[field] !== undefined) {
                const value = parseInt(updatedData[field]);
                if (value >= 1 && value <= 10)  user[field] = value;
               else throw new Error(`${field} must be between 1 and 10`);
            }
        });

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

module.exports = updateUser;