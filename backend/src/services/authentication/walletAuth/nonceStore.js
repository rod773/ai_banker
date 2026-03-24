const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * In-memory store mapping lowercase wallet address → { nonce, expiresAt }.
 * This is a simple implementation for demonstration purposes. In production, I would consider using a more robust solution like Redis with automatic expiration.
*/
const store = new Map();

/**
 * Saves a nonce for the given address, overwriting any previous pending entry.
 */
const saveNonce = (address, nonce) => {
  store.set(address, { nonce, expiresAt: Date.now() + NONCE_TTL_MS });
};

/** Retrieves and deletes the nonce for the given address (single-use).*/
const consumeNonce = (address) => {
  const entry = store.get(address);
  store.delete(address);

  if (!entry || Date.now() > entry.expiresAt) return null;

  return entry.nonce;
};

// Sweep expired entries on the same cadence as the TTL.
setInterval(() => {
  const now = Date.now();
  for (const [address, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(address);
  }
}, NONCE_TTL_MS).unref();

module.exports = { saveNonce, consumeNonce };
