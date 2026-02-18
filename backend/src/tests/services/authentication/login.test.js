process.env.JWT_SECRET = 'test-secret';

const login = require('../../../services/authentication/login');
const User = require('../../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Login Service', () => {
    process.env.JWT_SECRET = 'test-secret';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should login successfully and return JWT token', async () => {
        const mockUser = {
            username: 'user1',
            password: 'user1'
        };

        bcrypt.compare.mockResolvedValue(true);

        const mockToken = 'mock-jwt-token';
        jwt.sign.mockReturnValue(mockToken);

        User.findOne.mockResolvedValue(mockUser);

        const result = await login('user1', 'user1');

        expect(User.findOne).toHaveBeenCalledWith({ username: 'user1' });
        expect(bcrypt.compare).toHaveBeenCalledWith('user1', 'user1');
        expect(jwt.sign).toHaveBeenCalledWith(
            { username: 'user1' },
            'test-secret',
            { expiresIn: '1h' }
        );
        expect(result).toBe(mockToken);
    });

    it('should throw error when user is not found', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(login('nonexistentuser', 'password123'))
            .rejects
            .toThrow('User not found');
    });

    it('should throw error when password is invalid', async () => {
        const mockUser = {
            username: 'user1',
            password: 'user1'
        };

        User.findOne.mockResolvedValue(mockUser);

        bcrypt.compare.mockResolvedValue(false);

        await expect(login('user1', 'wrongpassword'))
            .rejects
            .toThrow('Invalid user credentials');
    });

    it('should handle database errors properly', async () => {
        const dbError = new Error('Database connection failed');
        User.findOne.mockRejectedValue(dbError);

        await expect(login('user1', 'user1'))
            .rejects
            .toThrow('Database connection failed');
    });

    it('should handle JWT generation errors', async () => {
        const mockUser = {
            username: 'user1',
            password: 'user1'
        };

        bcrypt.compare.mockResolvedValue(true);

        User.findOne.mockResolvedValue(mockUser);

        const jwtError = new Error('JWT generation failed');
        jwt.sign.mockImplementation(() => { throw jwtError; });

        await expect(login('user1', 'user1'))
            .rejects
            .toThrow('JWT generation failed');
    });
});