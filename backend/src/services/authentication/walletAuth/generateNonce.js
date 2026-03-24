const crypto = require('crypto');
const { saveNonce } = require('./nonceStore');

/**
 * Generates a cryptographically random nonce for the given wallet address
 * and persists it in the nonce store with a 5-minute TTL.
 *
 * @param {string} address - Ethereum wallet address
 * @returns {string} 32-character hex nonce
 */
const generateNonce = (address) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  saveNonce(address.toLowerCase(), nonce);
  return nonce;
};

module.exports = generateNonce;
