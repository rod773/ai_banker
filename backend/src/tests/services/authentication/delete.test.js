const deleteUser = require('../../../services/authentication/delete');
const User = require('../../../models/userModel');

jest.mock('../../../models/userModel');

describe('Delete User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete user successfully', async () => {
        const mockUser = {
            username: 'user1',
            password: 'user1'
        };

        User.findOne.mockResolvedValue(mockUser);

        const result = await deleteUser('user1');

        expect(User.findOne).toHaveBeenCalledWith({ username: 'user1' });
        expect(result).toBe('user1');
    });

    it('should throw error when user is not found', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(deleteUser('nonexistentuser'))
            .rejects
            .toThrow('User not found');
    });

    it('should handle database errors properly', async () => {
        const dbError = new Error('Database connection failed');
        User.findOne.mockRejectedValue(dbError);

        await expect(deleteUser('user1'))
            .rejects
            .toThrow('Database connection failed');
    });
});