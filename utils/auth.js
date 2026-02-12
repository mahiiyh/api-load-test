import http from 'k6/http';
import { check } from 'k6';
import { config } from '../config/env.js';
import { parseJSON, authFailures, log } from './helpers.js';

/**
 * Authentication utilities for AgriGen ERP
 */

/**
 * Login and get authentication token
 * @param {Object} credentials - User credentials {username, password}
 * @returns {string|null} Authentication token or null
 */
export function login(credentials) {
    const baseUrl = config.getBaseUrl();
    const loginUrl = `${baseUrl}${config.endpoints.auth.login}`;

    const payload = JSON.stringify(credentials);
    const params = {
        headers: config.headers
    };

    const response = http.post(loginUrl, payload, params);

    const checkResult = check(response, {
        'login successful': (r) => r.status === 200,
        'token received': (r) => {
            const body = parseJSON(r);
            // Check for token in both 'data' and 'token' fields
            return body && (body.data !== undefined || body.token !== undefined);
        }
    });

    if (!checkResult) {
        authFailures.add(1);
        log(`Login failed for ${credentials.username}`, 'error');
        return null;
    }

    const body = parseJSON(response);
    // Return token from 'data' field if present, otherwise try 'token' field
    return body ? (body.data || body.token) : null;
}

/**
 * Login with default admin user
 * @returns {string|null} Authentication token or null
 */
export function loginAsAdmin() {
    return login(config.testUsers.admin);
}

/**
 * Login with default manager user
 * @returns {string|null} Authentication token or null
 */
export function loginAsManager() {
    return login(config.testUsers.manager);
}

/**
 * Login with default regular user
 * @returns {string|null} Authentication token or null
 */
export function loginAsUser() {
    return login(config.testUsers.user);
}

/**
 * Logout user
 * @param {string} token - Authentication token
 * @returns {boolean} Success status
 */
export function logout(token) {
    const baseUrl = config.getBaseUrl();
    const logoutUrl = `${baseUrl}${config.endpoints.auth.logout}`;

    const params = {
        headers: {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        }
    };

    const response = http.post(logoutUrl, null, params);

    return check(response, {
        'logout successful': (r) => r.status === 200
    });
}

/**
 * Refresh authentication token
 * @param {string} token - Current authentication token
 * @returns {string|null} New token or null
 */
export function refreshToken(token) {
    const baseUrl = config.getBaseUrl();
    const refreshUrl = `${baseUrl}${config.endpoints.auth.refresh}`;

    const params = {
        headers: {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        }
    };

    const response = http.post(refreshUrl, null, params);

    const checkResult = check(response, {
        'refresh successful': (r) => r.status === 200,
        'new token received': (r) => {
            const body = parseJSON(r);
            return body && body.token !== undefined;
        }
    });

    if (!checkResult) {
        authFailures.add(1);
        return null;
    }

    const body = parseJSON(response);
    return body ? body.token : null;
}

export default {
    login,
    loginAsAdmin,
    loginAsManager,
    loginAsUser,
    logout,
    refreshToken
};
