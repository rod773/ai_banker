const User = require('../../models/userModel');

const deleteUser = async (username) => {
    try {
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        return username;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = deleteUser;