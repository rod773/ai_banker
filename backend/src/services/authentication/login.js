const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid user credentials');

        const token = jwt.sign(
            { username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return token;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = login;