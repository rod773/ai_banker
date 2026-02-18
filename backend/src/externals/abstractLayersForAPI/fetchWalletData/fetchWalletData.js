const fetchTokensAndNativeWalletData = require('./fetchTokensAndNativeWalletData');

async function fetchWalletData(walletAddress, chain) {
  switch (chain) {
    case 'ethereum':
      return await fetchTokensAndNativeWalletData(walletAddress, '0x1');
    case 'polygon':
      return await fetchTokensAndNativeWalletData(walletAddress, '0x89');
    case 'avalanche':
      return await fetchTokensAndNativeWalletData(walletAddress, '0xa86a');
    case 'arbitrum':
      return await fetchTokensAndNativeWalletData(walletAddress, '0xa4b1');
    case 'optimism':
      return await fetchTokensAndNativeWalletData(walletAddress, '0x10');
    case 'fantom':
      return await fetchTokensAndNativeWalletData(walletAddress, '0xfa'); 
    case 'binance':
      return await fetchTokensAndNativeWalletData(walletAddress, '0x38');
    case 'sepolia':
      return await fetchTokensAndNativeWalletData(walletAddress, '0xaa36a7');
    default:
      throw new Error('Unsupported chain');
  }
}

module.exports = fetchWalletData;