import React, { useState, useEffect } from 'react';
import useWalletAuth from '../../hooks/useWalletAuth';
import {
  discoverEip6963Providers,
  getFallbackProvider,
  walletEmoji,
  walletDescription,
} from '../../utils/walletDiscovery';
import '../Popup/Popup.css';
import './WalletSignIn.css';


export default function WalletSignIn({ onClose, onSuccess, onSwitchToPassword }) {
  const { signInWithWallet, isLoading, error, clearError } = useWalletAuth();
  const [activeWallet, setActiveWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const providers = await discoverEip6963Providers();
      if (!mounted) return;

      const seen = new Set();
      const list = [];
      for (const p of providers) {
        const key = p.rdns || p.name;
        if (seen.has(key)) continue;
        seen.add(key);
        list.push({
          key,
          provider: p.provider,
          name: p.name,
          rdns: p.rdns,
          icon: p.icon,
        });
      }

      if (list.length === 0) {
        const fallback = getFallbackProvider();
        if (fallback) {
          list.push({
            key: fallback.rdns || fallback.name,
            provider: fallback.provider,
            name: fallback.name,
            rdns: fallback.rdns,
            icon: fallback.icon,
          });
        }
      }

      setWallets(list);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(0);
    const timers = wallets.map((_, index) =>
      setTimeout(() => {
        setVisibleCount((prev) => Math.max(prev, index + 1));
      }, index * 90)
    );
    return () => timers.forEach(clearTimeout);
  }, [wallets]);

  const handleWalletSelect = async (wallet) => {
    clearError();
    setActiveWallet(wallet.key);
    try {
      const token = await signInWithWallet(wallet);
      onSuccess(token);
    } catch {
      // Error is stored in the hook's `error` state and rendered in the UI.
      // Swallowing it here keeps the modal open so the user can retry.
    } finally {
      setActiveWallet(null);
    }
  };

  const anyWalletDetected = wallets.length > 0;

  return (
    <div className="popup-overlay">
      <div className="popup wallet-signin-popup">
        <button className="close-button" onClick={onClose} aria-label="Close">×</button>

        <div className="wallet-signin-header">
          <span className="wallet-signin-emoji" aria-hidden="true">🔐</span>
          <h2>Sign In With Wallet</h2>
        </div>
        <p className="wallet-signin-subtitle">
          Connect your crypto wallet to authenticate securely — no password required.
        </p>

        {error && (
          <div className="wallet-error" role="alert">
            {error}
          </div>
        )}

        {!anyWalletDetected && (
          <div className="wallet-error" role="alert">
            No wallet extension detected. Install{' '}
            <strong>MetaMask</strong> or another browser wallet and refresh the page.
          </div>
        )}

        <div className="wallet-options">
          {wallets.map((wallet, index) => {
            const busy = isLoading && activeWallet === wallet.key;

            return (
              <button
                key={wallet.key}
                className={`wallet-option-btn${busy ? ' loading' : ''}`}
                onClick={() => handleWalletSelect(wallet)}
                disabled={isLoading}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <span className="wallet-option-icon">
                  {wallet.icon ? (
                    <img src={wallet.icon} alt={wallet.name} />
                  ) : (
                    walletEmoji(wallet.rdns, wallet.name)
                  )}
                </span>
                <span className="wallet-option-info">
                  <span className="wallet-option-name">{wallet.name}</span>
                  <span className="wallet-option-desc">
                    {walletDescription(wallet.rdns)}
                  </span>
                </span>
                {busy && <span className="spinner" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div className="wallet-divider">or</div>

        <button className="wallet-switch-link" onClick={onSwitchToPassword}>
          Sign in with username & password
        </button>

        <p className="wallet-security-note">
          You will be asked to sign a message in your wallet. This does not send any transaction
          or incur gas fees.
        </p>

        <div className="wallet-ambient-glow" aria-hidden="true" />
      </div>
    </div>
  );
}
