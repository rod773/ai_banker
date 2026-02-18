const generateProfitAndLossReport = require('../../../services/report/generateProfitAndLossReport');

describe('Generate Profit and Loss Report', () => {
    it('should calculate profit and loss correctly for mixed transactions', async () => {
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'receive', amount: 1.0, fee: 0.1 },
                { timestamp: '2025-01-02T00:00:00Z', type: 'send', amount: 0.5, fee: 0.05 }
            ]
        };
        const result = await generateProfitAndLossReport(walletInfo);

        expect(result).toEqual({
            Gains: 0.50000000,
            Loss: 0.65000000,
            Fees: 0.15000000,
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-01-02T00:00:00Z',
            currentHoldings: 0.50000000,
            portfolioReturnPercent: -50.00
        });
    });

    it('should handle only receive transactions', async () => {
        const timestamp = '2025-01-01T00:00:00Z';
        const walletInfo = {
            transactions: [
                { timestamp, type: 'receive', amount: 1.0, fee: 0.1 }
            ]
        };

        const result = await generateProfitAndLossReport(walletInfo);

        expect(result).toEqual({
            Gains: 0.00000000,
            Loss: 1.10000000,
            Fees: 0.10000000,
            startDate: timestamp,
            endDate: timestamp,
            currentHoldings: 1.00000000,
            portfolioReturnPercent: -100.00
        });
    });

    it('should handle empty transaction list', async () => {
        const walletInfo = {
            transactions: []
        };

        const result = await generateProfitAndLossReport(walletInfo);

        expect(result).toEqual({
            Gains: 0.00000000,
            Loss: 0.00000000,
            Fees: 0.00000000,
            startDate: "0000-00-00T00:00:00.000Z",
            endDate: "0000-00-00T00:00:00.000Z",
            currentHoldings: 0.00000000,
            portfolioReturnPercent: 0.00
        });
    });

    it('should handle transactions with no fees', async () => {
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'receive', amount: 1.0 },
                { timestamp: '2025-01-02T00:00:00Z', type: 'send', amount: 0.5 }
            ]
        };

        const result = await generateProfitAndLossReport(walletInfo);

        expect(result).toEqual({
            Gains: 0.50000000,
            Loss: 0.50000000,
            Fees: 0.00000000,
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-01-02T00:00:00Z',
            currentHoldings: 0.50000000,
            portfolioReturnPercent: -50.00
        });
    });
});