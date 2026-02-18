const bcrypt = require('bcryptjs');
const User = require('../../../models/userModel');
const updateUser = require('../../../services/authentication/update');

jest.mock('../../../models/userModel');
jest.mock('bcryptjs');

describe('updateUser', () => {
    let mockUser;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUser = {
            username: 'originalUser',
            password: 'oldHashedPassword',
            email: 'original@example.com',
            save: jest.fn(),
            riskAversion: 5,
            volatilityTolerance: 5,
            growthFocus: 5,
            cryptoExperience: 5,
            innovationTrust: 5,
            impactInterest: 5,
            diversification: 5,
            holdingPatience: 5,
            monitoringFrequency: 5,
            adviceOpenness: 5,
        };
    });

    it('should updates username successfully', async () => {
        User.findOne
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(null);

        const result = await updateUser('originalUser', { newUsername: 'newUser' });

        expect(mockUser.username).toBe('newUser');
        expect(mockUser.save).toHaveBeenCalled();
        expect(result.username).toBe('newUser');
    });

    it('should updates password successfully', async () => {
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.hash.mockResolvedValue('newHashedPassword');

        const result = await updateUser('originalUser', { newPassword: 'newPass123' });

        expect(mockUser.password).toBe('newHashedPassword');
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toHaveProperty('username', 'originalUser');
    });

    it('should updates email successfully', async () => {
        User.findOne
            .mockResolvedValueOnce(mockUser) 
            .mockResolvedValueOnce(null);

        const result = await updateUser('originalUser', { email: 'new@example.com' });

        expect(mockUser.email).toBe('new@example.com');
        expect(mockUser.save).toHaveBeenCalled();
        expect(result.email).toBe('new@example.com');
    });

    it('should updates profile fields successfully', async () => {
        User.findOne.mockResolvedValue(mockUser);

        const result = await updateUser('originalUser', {
            riskAversion: 8,
            cryptoExperience: 10
        });

        expect(mockUser.riskAversion).toBe(8);
        expect(mockUser.cryptoExperience).toBe(10);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result.riskAversion).toBe(8);
    });

    it('should throws error when user not found', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(updateUser('nonexistentUser', {})).rejects.toThrow('User not found');
    });

    it('should throws error if new username already exists', async () => {
        User.findOne
            .mockResolvedValueOnce(mockUser)  
            .mockResolvedValueOnce({ username: 'newUser' }); 

        await expect(updateUser('originalUser', { newUsername: 'newUser' }))
            .rejects.toThrow('Username already exists');
    });

    it('should throws error if new email already exists', async () => {
        User.findOne
            .mockResolvedValueOnce(mockUser)        
            .mockResolvedValueOnce({ email: 'taken@example.com' }); 

        await expect(updateUser('originalUser', { email: 'taken@example.com' }))
            .rejects.toThrow('Email already exists');
    });

    it('should throws error for out of range profile value', async () => {
        User.findOne.mockResolvedValue(mockUser);

        await expect(updateUser('originalUser', { growthFocus: 11 }))
            .rejects.toThrow('growthFocus must be between 1 and 10');
    });
});
