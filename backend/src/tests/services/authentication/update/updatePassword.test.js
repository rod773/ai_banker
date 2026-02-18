const bcrypt = require('bcryptjs');
const User = require('../../../../models/userModel');
const updatePassword = require('../../../../services/authentication/update/updatePassword');

jest.mock('../../../../models/userModel');
jest.mock('bcryptjs');

describe('Update Password Service', () => {
    const mockUser = {
        username: 'testuser',
        password: 'oldhashed',
        email: 'test@example.com',
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
        adviceOpenness: 5
    };

    beforeEach(() => {
        jest.clearAllMocks();
        User.findOne.mockReset();
        bcrypt.hash.mockReset();
        mockUser.save.mockReset();
    });

    it('should update password successfully', async () => {
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.hash.mockResolvedValue('newhashed');
        mockUser.save.mockResolvedValue(mockUser);

        const result = await updatePassword('testuser', 'newpassword');

        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            username: 'testuser',
            email: 'test@example.com'
        }));
        expect(result).not.toHaveProperty('password');
    });

    it('should handle non-existent user', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(updatePassword('nonexistent', 'newpassword'))
            .rejects
            .toThrow('User not found');
    });

    it('should handle missing new password', async () => {
        User.findOne.mockResolvedValue(mockUser);

        await expect(updatePassword('testuser', null))
            .rejects
            .toThrow('New password is required');
    });

    it('should handle password hashing error', async () => {
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

        await expect(updatePassword('testuser', 'newpassword'))
            .rejects
            .toThrow('Hashing failed');
    });
});