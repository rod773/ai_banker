const generateActionReport = require('../../../services/report/generateActionReport');

describe('Generate Action Report', () => {
    it('should handle empty transactions array', () => {
        const walletInfo = {
            coin: 'BTC',
            transactions: []
        };
        const result = generateActionReport(walletInfo);

        expect(result).toEqual({
            chain: 'BTC',
            calculationMethod: 'FIFO',
            totalActions: 0,
            tradingVolume: 0,
            buyActions: 0,
            sellActions: 0,
            firstTransactionDate: null,
            lastTransactionDate: null,
            avgHoldDurationDays: 0,
            longestHoldDays: 0,
            shortestHoldDays: 0,
            avgTradeSize: 0,
            maxTradeSize: 0,
            minTradeSize: 0
        });
    });

    it('should calculate correct metrics for mixed transactions', () => {
        const now = new Date();
        const yesterday = new Date(now - 24 * 60 * 60 * 1000);
        const walletInfo = {
            coin: 'ETH',
            transactions: [
                { 
                    txid: 'tx1',
                    amount: 1.5, 
                    type: 'receive',
                    timestamp: yesterday.toISOString()
                },
                { 
                    txid: 'tx2',
                    amount: 0.5, 
                    type: 'send',
                    timestamp: now.toISOString()
                }
            ]
        };
        const result = generateActionReport(walletInfo);

        expect(result).toEqual({
            chain: 'ETH',
            calculationMethod: 'FIFO',
            totalActions: 2,
            tradingVolume: 2,
            buyActions: 1,
            sellActions: 1,
            firstTransactionDate: yesterday.toISOString(),
            lastTransactionDate: now.toISOString(),
            avgHoldDurationDays: 1,
            longestHoldDays: 1,
            shortestHoldDays: 1,
            avgTradeSize: 1,
            maxTradeSize: 1.5,
            minTradeSize: 0.5
        });
    });

    it('should handle only receive transactions', () => {
        const timestamp = new Date().toISOString();
        const walletInfo = {
            coin: 'BTC',
            transactions: [
                { 
                    txid: 'tx1',
                    amount: 1.0, 
                    type: 'receive',
                    timestamp
                },
                { 
                    txid: 'tx2',
                    amount: 2.0, 
                    type: 'receive',
                    timestamp
                }
            ]
        };
        const result = generateActionReport(walletInfo);

        expect(result).toEqual({
            chain: 'BTC',
            calculationMethod: 'FIFO',
            totalActions: 2,
            tradingVolume: 3,
            buyActions: 2,
            sellActions: 0,
            firstTransactionDate: timestamp,
            lastTransactionDate: timestamp,
            avgHoldDurationDays: 0,
            longestHoldDays: 0,
            shortestHoldDays: 0,
            avgTradeSize: 1.5,
            maxTradeSize: 2,
            minTradeSize: 1
        });
    });
});