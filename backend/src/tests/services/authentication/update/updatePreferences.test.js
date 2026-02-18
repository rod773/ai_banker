const User = require('../../../../models/userModel');
const updatePreferences = require('../../../../services/authentication/update/updatePreferences');

jest.mock('../../../../models/userModel');

describe('Update Preferences Service', () => {
    const mockUser = {
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

    beforeEach(() => {
        jest.clearAllMocks();
        User.findOne.mockReset();
        mockUser.save.mockReset();
    });

    it('should update preferences successfully', async () => {
        User.findOne.mockResolvedValue(mockUser);

        const result = await updatePreferences('originalUser', {
            riskAversion: 8,
            cryptoExperience: 10
        });

        expect(mockUser.riskAversion).toBe(8);
        expect(mockUser.cryptoExperience).toBe(10);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result.riskAversion).toBe(8);
    });

    it('should handle non-existent user', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(updatePreferences('nonexistent', { riskAversion: 7 }))
            .rejects
            .toThrow('User not found');
    });

    it('should handle invalid preference values', async () => {
        User.findOne.mockResolvedValue(mockUser);

        await expect(updatePreferences('testuser', { riskAversion: 11 }))
            .rejects
            .toThrow('riskAversion must be a number between 1 and 10');
    });

    it('should handle partial preference updates', async () => {
        User.findOne.mockResolvedValue(mockUser);
        mockUser.save.mockResolvedValue(mockUser);

        const result = await updatePreferences('testuser', { riskAversion: 8 });

        expect(result.riskAversion).toBe(8);
        expect(result.volatilityTolerance).toBe(5);
    });
});