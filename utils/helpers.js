import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

/**
 * Custom Metrics
 */
export const errorRate = new Rate('errors');
export const successRate = new Rate('success');
export const apiDuration = new Trend('api_duration');
export const authFailures = new Counter('auth_failures');

/**
 * Generate random string
 * @param {number} length - Length of string to generate
 * @returns {string} Random string
 */
export function randomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate random number within range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random email
 * @returns {string} Random email address
 */
export function randomEmail() {
    return `user_${randomString(8)}@agrigen.com`;
}

/**
 * Sleep for random duration
 * @param {number} min - Minimum sleep time in seconds
 * @param {number} max - Maximum sleep time in seconds
 */
export function randomSleep(min = 1, max = 3) {
    sleep(randomInt(min, max));
}

/**
 * Check response status and update metrics
 * @param {Object} response - HTTP response object
 * @param {number} expectedStatus - Expected status code
 * @param {string} checkName - Name for the check
 * @returns {boolean} Whether check passed
 */
export function checkResponse(response, expectedStatus = 200, checkName = 'status check') {
    const checkResult = check(response, {
        [checkName]: (r) => r.status === expectedStatus,
        'response time < 1000ms': (r) => r.timings.duration < 1000,
    });

    // Update custom metrics
    errorRate.add(!checkResult);
    successRate.add(checkResult);
    apiDuration.add(response.timings.duration);

    return checkResult;
}

/**
 * Check multiple conditions on response
 * @param {Object} response - HTTP response object
 * @param {Object} checks - Object with check conditions
 * @returns {boolean} Whether all checks passed
 */
export function checkMultiple(response, checks) {
    const result = check(response, checks);
    errorRate.add(!result);
    successRate.add(result);
    apiDuration.add(response.timings.duration);
    return result;
}

/**
 * Parse response body as JSON safely
 * @param {Object} response - HTTP response object
 * @returns {Object|null} Parsed JSON or null
 */
export function parseJSON(response) {
    try {
        return JSON.parse(response.body);
    } catch (e) {
        console.error('Failed to parse JSON:', e);
        return null;
    }
}

/**
 * Log test information
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error)
 */
export function log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
}

/**
 * Create authorization header
 * @param {string} token - Authentication token
 * @returns {Object} Headers object with authorization
 */
export function authHeader(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

/**
 * Generate test inventory item
 * @returns {Object} Test inventory data
 */
export function generateInventoryItem() {
    return {
        name: `Product_${randomString(8)}`,
        sku: `SKU-${randomInt(10000, 99999)}`,
        quantity: randomInt(10, 1000),
        price: randomInt(100, 10000),
        category: ['Seeds', 'Fertilizers', 'Pesticides', 'Equipment'][randomInt(0, 3)],
        supplier: `Supplier_${randomInt(1, 10)}`
    };
}

/**
 * Generate test sales order
 * @returns {Object} Test sales order data
 */
export function generateSalesOrder() {
    return {
        customer: `Customer_${randomInt(1, 100)}`,
        items: [
            {
                productId: randomInt(1, 100),
                quantity: randomInt(1, 50),
                price: randomInt(100, 1000)
            }
        ],
        totalAmount: randomInt(1000, 50000),
        tax: randomInt(100, 5000),
        discount: randomInt(0, 1000)
    };
}

/**
 * Generate test purchase order
 * @returns {Object} Test purchase order data
 */
export function generatePurchaseOrder() {
    return {
        supplier: `Supplier_${randomInt(1, 50)}`,
        items: [
            {
                productId: randomInt(1, 100),
                quantity: randomInt(10, 500),
                price: randomInt(50, 5000)
            }
        ],
        totalAmount: randomInt(5000, 100000),
        deliveryDate: new Date(Date.now() + randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString()
    };
}

export default {
    randomString,
    randomInt,
    randomEmail,
    randomSleep,
    checkResponse,
    checkMultiple,
    parseJSON,
    log,
    authHeader,
    generateInventoryItem,
    generateSalesOrder,
    generatePurchaseOrder,
    errorRate,
    successRate,
    apiDuration,
    authFailures
};
