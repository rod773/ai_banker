const register = require('../../../services/authentication/register');
const bcrypt = require('bcryptjs');
const User = require('../../../models/userModel');

jest.mock('bcryptjs');
jest.mock('../../../models/userModel');

describe('register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUserData = {
        username: 'testuser2',
        password: 'testuser2',
        email: 'test2@example.com',
        riskAversion: 7,
        volatilityTolerance: 6,
        growthFocus: 8,
        cryptoExperience: 5,
        innovationTrust: 7,
        impactInterest: 6,
        diversification: 8,
        holdingPatience: 7,
        monitoringFrequency: 8,
        adviceOpenness: 6,
    };

    it('should register a new user successfully', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashed_password');

        const saveMock = jest.fn().mockResolvedValue();

        User.mockImplementation((data) => ({
            ...data,
            save: saveMock
        }));

        const result = await register(mockUserData);

        expect(User.findOne).toHaveBeenCalledWith({
            $or: [
                { username: mockUserData.username },
                { email: mockUserData.email }
            ]
        });

        expect(saveMock).toHaveBeenCalled();

        expect(result).toEqual({
            username: mockUserData.username,
            email: mockUserData.email,
            riskAversion: 7,
            volatilityTolerance: 6,
            growthFocus: 8,
            cryptoExperience: 5,
            innovationTrust: 7,
            impactInterest: 6,
            diversification: 8,
            holdingPatience: 7,
            monitoringFrequency: 8,
            adviceOpenness: 6
        });
    });

    it('should throw error if username already exists', async () => {
        User.findOne.mockResolvedValue({ username: 'testuser2' });

        await expect(register(mockUserData)).rejects.toThrow('Username already exists');
    });

    it('should throw error if email already exists', async () => {
        User.findOne.mockResolvedValue({ email: 'test2@example.com', username: 'otheruser' });

        await expect(register(mockUserData)).rejects.toThrow('Email already exists');
    });

    it('should throw generic error', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        await expect(register(mockUserData)).rejects.toThrow('Database error');
    });
});
