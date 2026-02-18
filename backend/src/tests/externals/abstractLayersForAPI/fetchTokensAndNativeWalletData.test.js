const Moralis = require('moralis').default;
const fetchTokensAndNativeWalletData = require('../../../externals/abstractLayersForAPI/fetchWalletData/fetchTokensAndNativeWalletData');

jest.mock('moralis', () => ({
    default: {
        start: jest.fn(),
        EvmApi: {
            balance: {
                getNativeBalance: jest.fn()
            },
            token: {
                getWalletTokenBalances: jest.fn(),
                getWalletTokenTransfers: jest.fn()
            },
            transaction: {
                getWalletTransactions: jest.fn()
            }
        }
    }
}));

describe('fetchTokensAndNativeWalletData', () => {
    const mockAddress = '0xTestAddress';
    const mockChain = '0x1';

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock successful responses
        Moralis.EvmApi.balance.getNativeBalance.mockResolvedValue({
            raw: { balance: '1000000000000000000' } // 1 ETH
        });

        Moralis.EvmApi.token.getWalletTokenBalances.mockResolvedValue({
            raw: [{
                symbol: 'USDT',
                balance: '1000000',
                decimals: 6
            }]
        });

        Moralis.EvmApi.transaction.getWalletTransactions.mockResolvedValue({
            raw: {
                result: [{
                    hash: 'tx1',
                    block_timestamp: '2025-01-01T00:00:00Z',
                    from_address: mockAddress,
                    value: '500000000000000000', // 0.5 ETH
                    transaction_fee: '21000000000000'
                }]
            }
        });

        Moralis.EvmApi.token.getWalletTokenTransfers.mockResolvedValue({
            raw: {
                result: [{
                    transaction_hash: 'tx2',
                    block_timestamp: '2025-01-02T00:00:00Z',
                    from_address: 'other',
                    to_address: mockAddress,
                    value: '500000',
                    symbol: 'USDT',
                    decimal: 6,
                    address: '0xUSDTAddress'
                }]
            }
        });
    });

    it('should fetch and format wallet data correctly', async () => {
        const result = await fetchTokensAndNativeWalletData(mockAddress, mockChain);

        expect(result).toEqual({
            chain: 'ethereum',
            balances: {
                nativeBalance: {
                    symbol: 'ETH',
                    balance: 1
                },
                tokens: [{
                    symbol: 'USDT',
                    balance: 1
                }]
            },
            transactions: expect.arrayContaining([
                expect.objectContaining({
                    txid: 'tx1',
                    type: 'send',
                    amount: 0.5,
                    symbol: 'ETH',
                    isNative: true
                }),
                expect.objectContaining({
                    txid: 'tx2',
                    type: 'receive',
                    amount: 0.5,
                    symbol: 'USDT',
                    isNative: false
                })
            ])
        });

        expect(Moralis.start).toHaveBeenCalled();
        expect(Moralis.EvmApi.balance.getNativeBalance).toHaveBeenCalledWith({
            chain: mockChain,
            address: mockAddress
        });
    });

    it('should handle empty balances', async () => {
        Moralis.EvmApi.balance.getNativeBalance.mockResolvedValue({
            raw: { balance: '0' }
        });
        Moralis.EvmApi.token.getWalletTokenBalances.mockResolvedValue({
            raw: []
        });

        const result = await fetchTokensAndNativeWalletData(mockAddress, mockChain);

        expect(result.balances).toEqual({
            tokens: [],
            nativeBalance: null
        });
    });

    it('should handle unknown chain', async () => {
        const result = await fetchTokensAndNativeWalletData(mockAddress, 'unknown');

        expect(result.chain).toBe('Unknown');
    });
});