const getUserPreferencesByUsername = require('../../../services/user/getUserPreferencesByUsername');
const User = require('../../../models/userModel');

jest.mock('../../../models/userModel');

describe('getUserPreferencesByUsername', () => {
    it('should return user preferences when user exists', async () => {
        const mockUserData = {
            username: 'testuser',
            password: 'testuser',
            email: 'test@example.com',
            riskAversion: 3,
            volatilityTolerance: 7,
            growthFocus: 8,
            cryptoExperience: 6,
            innovationTrust: 9,
            impactInterest: 4,
            diversification: 5,
            holdingPatience: 10,
            monitoringFrequency: 2,
            adviceOpenness: 8,
        };

        User.findOne.mockResolvedValue(mockUserData);

        const result = await getUserPreferencesByUsername('testuser');

        expect(result).toEqual({
            riskAversion: 3,
            volatilityTolerance: 7,
            growthFocus: 8,
            cryptoExperience: 6,
            innovationTrust: 9,
            impactInterest: 4,
            diversification: 5,
            holdingPatience: 10,
            monitoringFrequency: 2,
            adviceOpenness: 8,
        });
    });

    it('should throw an error if user not found', async () => {
        User.findOne.mockResolvedValue(null);

        try {
            await getUserPreferencesByUsername('nonexistentuser');
        } catch (error) {
            expect(error.message).toBe('Failed to fetch user details: User not found');
        }
    });

    it('should handle errors from the database query', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        try {
            await getUserPreferencesByUsername('testuser');
        } catch (error) {
            expect(error.message).toBe('Failed to fetch user details: Database error');
        }
    });
});
