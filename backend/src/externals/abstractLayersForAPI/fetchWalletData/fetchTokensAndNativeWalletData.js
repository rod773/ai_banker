const Moralis = require('moralis').default;

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

let isInitialized = false;

async function initializeMoralis() {
    if (!isInitialized) {
        try {
            await Moralis.start({
                apiKey: MORALIS_API_KEY
            });
            isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize Moralis:', error);
            throw error;
        }
    }
}

async function getBalances(address, chain) {
    try {
        const result = { tokens: [], nativeBalance: null };

        const nativeResponse = await Moralis.EvmApi.balance.getNativeBalance({
            chain: chain,
            address: address
        });

        if (nativeResponse.raw.balance && Number(nativeResponse.raw.balance) > 0) {
            result.nativeBalance = {
                symbol: 'ETH',
                balance: Number(nativeResponse.raw.balance) / 1e18
            };
        }

        const tokenResponse = await Moralis.EvmApi.token.getWalletTokenBalances({
            chain: chain,
            address: address
        });

        if (tokenResponse.raw && tokenResponse.raw.length > 0) {
            result.tokens = tokenResponse.raw.map(token => ({
                symbol: token.symbol,
                balance: Number(token.balance) / Math.pow(10, token.decimals),
            }));
        }

        return result;

    } catch (error) {
        throw new Error('Failed to fetch wallet balance: ' + error.message);
    }
}

async function getTransactions(address, chain) {
    try {
        const nativeResponse = await Moralis.EvmApi.transaction.getWalletTransactions({
            chain: chain,
            order: "DESC",
            address: address
        });

        const tokenResponse = await Moralis.EvmApi.token.getWalletTokenTransfers({
            chain: chain,
            order: "DESC",
            address: address
        });

        const nativeTransactions = nativeResponse.raw.result.map(tx => {
            const isSender = tx.from_address.toLowerCase() === address.toLowerCase();
            const amountEth = Number(tx.value) / 1e18;
            const feeEth = Number(tx.transaction_fee);

            return {
                txid: tx.hash,
                timestamp: tx.block_timestamp,
                type: isSender ? "send" : "receive",
                fee: isSender ? feeEth : 0,
                amount: amountEth,
                symbol: 'ETH',
                isNative: true
            };
        });

        const tokenTransactions = tokenResponse.raw.result.map(tx => {
            const isSender = tx.from_address.toLowerCase() === address.toLowerCase();
            const amount = Number(tx.value) / Math.pow(10, Number(tx.decimal || 18));

            return {
                txid: tx.transaction_hash,
                timestamp: tx.block_timestamp,
                type: isSender ? "send" : "receive",
                fee: 0,
                amount: amount,
                symbol: tx.symbol || 'Unknown',
                tokenAddress: tx.address,
                isNative: false
            };
        });

        const allTransactions = [...nativeTransactions, ...tokenTransactions]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return allTransactions;

    } catch (error) {
        console.error("Transaction fetch error:", error);
        throw new Error("Failed to fetch transactions: " + error.message);
    }
}

async function fetchTokensAndNativeWalletData(address, chain) {
    try {
        await initializeMoralis();
        const balances = await getBalances(address, chain);
        const transactions = await getTransactions(address, chain);

        let coinSymbol;
        switch (chain) {
            case '0x1': coinSymbol = 'ethereum'; break;
            case '0x89': coinSymbol = 'polygon'; break;
            case '0xa86a': coinSymbol = 'avalanche'; break;
            case '0xa4b1': coinSymbol = 'arbitrum'; break;
            case '0x10': coinSymbol = 'optimism'; break;
            case '0xfa': coinSymbol = 'fantom'; break;
            case '0x38': coinSymbol = 'binancecoin'; break;
            case '0xaa36a7': coinSymbol = 'sepolia'; break;
            default: coinSymbol = 'Unknown';
        }

        return {
            chain: coinSymbol,
            balances: balances,
            transactions: transactions
        };
    } catch (error) {
        throw new Error(`Failed to fetch wallet data for ${coinType}: ${error.message}`);
    }
}

module.exports = fetchTokensAndNativeWalletData;
