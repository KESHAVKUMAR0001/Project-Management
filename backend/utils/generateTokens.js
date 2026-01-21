/**
 * Token Generator Helper (utils/generateTokens.js)
 * 
 * WHAT IT DOES:
 * Helper functions to generate JWT Access Tokens and Refresh Tokens.
 * 
 * WHY IT IS NEEDED:
 * JWT (JSON Web Token) is used to securely verify user identity across REST API calls.
 * - Access Token: Short-lived token sent in HTTP Authorization header for API requests.
 * - Refresh Token: Long-lived token stored safely to get a new access token when it expires.
 */

const jwt = require('jsonwebtoken');

// Generate short-lived Access Token (e.g. 15 minutes)
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

// Generate long-lived Refresh Token (e.g. 7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};
