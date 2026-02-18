const getUserPreferencesController = require('../../controllers/userController');
const getUserPreferencesByUsername = require('../../services/user/getUserPreferencesByUsername');

jest.mock('../../services/user/getUserPreferencesByUsername');

describe('User Controller', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = {
            params: {}
        };
        mockRes = {
            json: jest.fn().mockReturnThis()
        };
    });

    describe('getUserPreferencesController', () => {
        const mockPreferences = {
            riskAversion: 3,
            volatilityTolerance: 4,
            growthFocus: 5,
            cryptoExperience: 2,
            innovationTrust: 4,
            impactInterest: 3,
            diversification: 5,
            holdingPatience: 4,
            monitoringFrequency: 2,
            adviceOpenness: 5
        };

        it('should return preferences for valid username', async () => {
            // Arrange
            mockReq.params.username = 'testuser';
            getUserPreferencesByUsername.mockResolvedValue(mockPreferences);

            // Act
            await getUserPreferencesController(mockReq, mockRes);

            // Assert
            expect(getUserPreferencesByUsername).toHaveBeenCalledWith('testuser');
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 200,
                data: {
                    type: 'Success',
                    message: mockPreferences
                }
            });
        });

        it('should return bad request when username is missing', async () => {
            // Act
            await getUserPreferencesController(mockReq, mockRes);

            // Assert
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 400,
                error: {
                    type: 'BadRequest',
                    message: 'Username is required',
                }
            });

            expect(getUserPreferencesByUsername).not.toHaveBeenCalled();
        });


        it('should handle service errors', async () => {
            mockReq.params.username = 'testuser';
            const error = new Error('Service error');
            getUserPreferencesByUsername.mockRejectedValue(error);

            await getUserPreferencesController(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                status: 500,
                error: {
                    type: 'InternalServerError',
                    message: 'Service error'
                }
            });
        });
    });
});