const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../../models/userModel');
const { consumeNonce } = require('./nonceStore');

const JWT_SECRET = process.env.JWT_SECRET;
const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const NONCE_LINE_REGEX = /^Nonce: ([a-f0-9]+)$/m;

/**
 * Verifies a Sign-In with Ethereum (EIP-4361) message and signature.
 * On success, finds or creates a wallet-based user and issues a JWT.
 *
 * @param {string} address   - Claimed signer address
 * @param {string} message   - EIP-4361 plain-text message the user signed
 * @param {string} signature - Hex signature produced by the wallet
 * @returns {string} JWT token
 */
const verifyWalletSignature = async ({ address, message, signature }) => {
  if (!ETHEREUM_ADDRESS_REGEX.test(address)) {
    throw new Error('Invalid Ethereum address');
  }

  const normalizedAddress = address.toLowerCase();

  // 1. Recover the signer from the message + signature
  let recoveredAddress;
  try {
    recoveredAddress = ethers.verifyMessage(message, signature).toLowerCase();
  } catch {
    throw new Error('Invalid signature');
  }

  // 2. Ensure recovered address matches the claimed address
  if (recoveredAddress !== normalizedAddress) {
    throw new Error('Signature address mismatch');
  }

  // 3. Extract the nonce from the signed message and verify it
  const nonceMatch = message.match(NONCE_LINE_REGEX);
  if (!nonceMatch) throw new Error('Invalid message format: missing nonce');

  const storedNonce = consumeNonce(normalizedAddress);
  if (!storedNonce || storedNonce !== nonceMatch[1]) {
    throw new Error('Invalid or expired nonce');
  }

  // 4. Find or create the wallet user
  let user = await User.findOne({ walletAddress: normalizedAddress });

  if (!user) {
    // Auto-generate credentials for wallet-only accounts.
    const shortAddr = normalizedAddress.slice(2, 14);
    user = new User({
      username: `wallet_${shortAddr}`,
      password: crypto.randomBytes(32).toString('hex'),
      email: `${shortAddr}@wallet.io`,
      walletAddress: normalizedAddress,
      riskAversion: 5,
      volatilityTolerance: 5,
      growthFocus: 5,
      cryptoExperience: 5,
      innovationTrust: 5,
      impactInterest: 5,
      diversification: 5,
      holdingPatience: 5,
      monitoringFrequency: 5,
      adviceOpenness: 5,
    });
    await user.save();
  }

  // 5. Issue JWT using the same payload shape as password login
  const token = jwt.sign(
    { username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

module.exports = verifyWalletSignature;
