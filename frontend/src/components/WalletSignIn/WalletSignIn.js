import React, { useState, useEffect } from 'react';
import useWalletAuth from '../../hooks/useWalletAuth';
import '../Popup/Popup.css';
import './WalletSignIn.css';

const WALLET_OPTIONS = [
  {
    type: 'metamask',
    name: 'MetaMask',
    description: 'Browser extension wallet',
    icon: '🦊',
    requiresExtension: true,
    detectKey: 'isMetaMask',
  },
  {
    type: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Browser extension or mobile',
    icon: '🔵',
    requiresExtension: true,
    detectKey: 'isCoinbaseWallet',
  },
  {
    type: 'phantom',
    name: 'Phantom',
    description: 'Solana & Ethereum wallet',
    icon: '👻',
    requiresExtension: true,
    detectKey: 'isPhantom',
  },
  {
    type: 'brave',
    name: 'Brave Wallet',
    description: 'Built-in Brave browser wallet',
    icon: '🦁',
    requiresExtension: true,
    detectKey: 'isBraveWallet',
  },
  {
    type: 'injected',
    name: 'Browser Wallet',
    description: 'Any injected EIP-1193 wallet',
    icon: '🌐',
    requiresExtension: false,
    detectKey: null,
  },
];

/**
 * Reads window.ethereum and returns the set of boolean flag keys that are true
 * (e.g. 'isMetaMask', 'isCoinbaseWallet'). Used to determine which wallet
 * options are available without relying on user-agent sniffing.
 */
const getDetectedKeys = () => {
  const eth = window.ethereum;
  if (!eth) return new Set();
  return new Set(Object.keys(eth).filter((k) => eth[k] === true));
};


export default function WalletSignIn({ onClose, onSuccess, onSwitchToPassword }) {
  const { signInWithWallet, isLoading, error, clearError } = useWalletAuth();
  const [activeWallet, setActiveWallet] = useState(null);
  const [detectedKeys, setDetectedKeys] = useState(new Set());

  useEffect(() => {
    setDetectedKeys(getDetectedKeys());
  }, []);

  const isWalletAvailable = (option) => {
    if (!window.ethereum) return false;
    if (!option.requiresExtension) return true;
    if (!option.detectKey) return true;
    return detectedKeys.has(option.detectKey);
  };

  const handleWalletSelect = async (walletType) => {
    clearError();
    setActiveWallet(walletType);
    try {
      const token = await signInWithWallet();
      onSuccess(token);
    } catch {
      // Error is stored in the hook's `error` state and rendered in the UI.
      // Swallowing it here keeps the modal open so the user can retry.
    } finally {
      setActiveWallet(null);
    }
  };

  const anyWalletDetected = !!window.ethereum;

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
          {WALLET_OPTIONS.map((option, index) => {
            const available = isWalletAvailable(option);
            const busy = isLoading && activeWallet === option.type;

            return (
              <button
                key={option.type}
                className={`wallet-option-btn${busy ? ' loading' : ''}`}
                onClick={() => handleWalletSelect(option.type)}
                disabled={isLoading || !available}
                title={!available ? `${option.name} not detected` : undefined}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <span className="wallet-option-icon">{option.icon}</span>
                <span className="wallet-option-info">
                  <span className="wallet-option-name">{option.name}</span>
                  <span className="wallet-option-desc">
                    {available ? option.description : 'Not detected — install extension'}
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
