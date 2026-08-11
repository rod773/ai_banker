const RDNS_EMOJI = {
  'io.metamask': '🦊',
  'com.coinbase.wallet': '🔵',
  'app.phantom': '👻',
  'com.brave.wallet': '🦁',
  'so.onekey.wallet': '🧿',
};

const RDNS_DESCRIPTION = {
  'io.metamask': 'Browser extension wallet',
  'com.coinbase.wallet': 'Browser extension or mobile',
  'app.phantom': 'Solana & Ethereum wallet',
  'com.brave.wallet': 'Built-in Brave browser wallet',
  'so.onekey.wallet': 'Multi-chain wallet',
};

/**
 * Discovers installed wallets via EIP-6963. Each provider reports its real
 * identity (name, rdns), avoiding impersonation where wallets like OneKey
 * set `isMetaMask: true` on window.ethereum.
 */
export const discoverEip6963Providers = () =>
  new Promise((resolve) => {
    let settled = false;
    const providers = [];
    const timer = setTimeout(finish, 600);

    function handler(event) {
      const detail = event.detail || {};
      if (!detail?.provider) return;
      const info = detail.info || {};
      providers.push({
        provider: detail.provider,
        name: info.name || 'Wallet',
        rdns: info.rdns || null,
        icon: info.icon || null,
      });
    }

    function finish() {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      window.removeEventListener('eip6963:announceProvider', handler);
      resolve(providers);
    }

    window.addEventListener('eip6963:announceProvider', handler);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
  });

/**
 * Fallback for legacy wallets that do not announce via EIP-6963 yet.
 * Reports window.ethereum using its own detection flags.
 */
export const getFallbackProvider = () => {
  const eth = window.ethereum;
  if (!eth) return null;

  let name = 'Browser Wallet';
  if (eth.isMetaMask) name = 'MetaMask';
  else if (eth.isCoinbaseWallet) name = 'Coinbase Wallet';
  else if (eth.isBraveWallet) name = 'Brave Wallet';
  else if (eth.isPhantom) name = 'Phantom';

  return {
    provider: eth,
    name,
    rdns: null,
    icon: null,
  };
};

export const walletEmoji = (rdns, name) =>
  RDNS_EMOJI[rdns] || (name ? name.split(' ')[0][0] : '🌐');

export const walletDescription = (rdns) =>
  RDNS_DESCRIPTION[rdns] || 'Connected browser wallet';