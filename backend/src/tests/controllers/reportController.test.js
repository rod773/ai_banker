const reportController = require('../../controllers/reportController');
const generateReport = require('../../services/report/generateReport');

jest.mock('../../services/report/generateReport');

describe('Report Controller', () => {
    const mockRequest = (body = {}, user = {}) => ({ body, user });
    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('reportController', () => {
        it('should generate report successfully', async () => {
            const mockReport = {
                actions: { totalActions: 2 },
                profitAndLoss: { totalGain: 100 },
                insights: 'Test analysis'
            };

            generateReport.mockResolvedValue(mockReport);

            const req = mockRequest({
                walletAddress: '0x123',
                chain: 'ETH'
            }, { username: 'testuser' });

            const res = mockResponse();

            await reportController(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                data: {
                    type: 'Success',
                    message: mockReport
                }
            });
        });

        it('should handle missing parameters', async () => {
            const req = mockRequest({ walletAddress: '0x123' }, { username: 'testuser' }); 
            const res = mockResponse();

            await reportController(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                error: {
                    type: 'BadRequest',
                    message: 'walletAddress and chain are required'
                }
            });
        });

        it('should handle report generation errors', async () => {
            generateReport.mockRejectedValue(new Error('Failed to fetch data'));

            const req = mockRequest({
                walletAddress: '0x123',
                chain: 'ETH'
            }, { username: 'testuser' });
            const res = mockResponse();

            await reportController(req, res);

            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                error: {
                    type: 'InternalServerError',
                    message: 'Failed to fetch data'
                }
            });
        });
    });
});
