// /src/utils/tokenUtils.js
import { jwtDecode } from 'jwt-decode';

/**
 * Gets the expiration date of a JWT token.
 * @param {string} token - JWT token.
 * @returns {Date|null} - Expiration date or null if not available.
 */
export const getTokenExpirationDate = (token) => {
    try {
        if (!token || token === 'undefined') return null;
        const decoded = jwtDecode(token);
        if (!decoded.exp) {
            return null;
        }

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Checks if a token is expired.
 * @param {string} token - JWT token.
 * @returns {boolean} - True if expired, else false.
 */
export const isTokenExpired = (token) => {
    const expirationDate = getTokenExpirationDate(token);
    if (!expirationDate) {
        return true; // Consider token expired if no expiration info
    }
    return expirationDate < new Date();
};