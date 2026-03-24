import { useState, useCallback } from 'react';


const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const detectInjectedWallet = () => {
  const { ethereum } = window;
  if (!ethereum) return null;

  let name = 'Browser Wallet';
  if (ethereum.isMetaMask) name = 'MetaMask';
  else if (ethereum.isCoinbaseWallet) name = 'Coinbase Wallet';
  else if (ethereum.isBraveWallet) name = 'Brave Wallet';

  return { provider: ethereum, name };
};

/**
 * Builds a Sign-In with Ethereum message following the EIP-4361 plain-text format. */
const buildSiweMessage = (address, nonce) => {
  const domain = window.location.host;
  const uri = window.location.origin;
  const issuedAt = new Date().toISOString();

  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    '',
    'Sign in to AI Banker',
    '',
    `URI: ${uri}`,
    'Version: 1',
    'Chain ID: 1',
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join('\n');
};

const useWalletAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  /**Executes the full wallet sign-in pipeline and returns the JWT on success.*/
  const signInWithWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1 — detect injected wallet provider
      const detected = detectInjectedWallet();
      if (!detected) {
        throw new Error('No wallet extension detected. Please install MetaMask or another browser wallet.');
      }
      const { provider } = detected;

      // Step 2 — request account access (prompts the user in the wallet UI)
      let accounts;
      try {
        accounts = await provider.request({ method: 'eth_requestAccounts' });
      } catch (err) {
        if (err.code === 4001) throw new Error('Wallet connection rejected by user.');
        throw new Error(`Could not connect to wallet: ${err.message}`);
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet.');
      }

      const address = accounts[0];

      // Step 3 — fetch a single-use nonce from the backend
      const nonceRes = await fetch(`${API_BASE}/auth/wallet/nonce?address=${address}`);
      if (!nonceRes.ok) {
        throw new Error(`Failed to obtain nonce from server (HTTP ${nonceRes.status}).`);
      }

      const nonceData = await nonceRes.json();
      if (!nonceData?.data?.message?.nonce) {
        throw new Error('Server returned an unexpected response for nonce request.');
      }

      const { nonce } = nonceData.data.message;

      // Step 4 — present the EIP-4361 message to the user for signing
      const message = buildSiweMessage(address, nonce);

      let signature;
      try {
        signature = await provider.request({
          method: 'personal_sign',
          params: [message, address],
        });
      } catch (err) {
        if (err.code === 4001) throw new Error('Signature request rejected by user.');
        throw new Error(`Signing failed: ${err.message}`);
      }

      // Step 5 — send the signature to the backend for verification and receive a JWT
      const verifyRes = await fetch(`${API_BASE}/auth/wallet/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData?.data?.message) {
        throw new Error(verifyData?.data?.message || 'Wallet verification failed.');
      }

      return verifyData.data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { signInWithWallet, isLoading, error, clearError };
};

export default useWalletAuth;
