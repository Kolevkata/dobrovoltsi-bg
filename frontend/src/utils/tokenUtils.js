// /src/utils/tokenUtils.js
import { jwtDecode } from 'jwt-decode'; // Changed import

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

export const isTokenExpired = (token) => {
    const expirationDate = getTokenExpirationDate(token);
    if (!expirationDate) {
        return true;
    }
    return expirationDate < new Date();
};