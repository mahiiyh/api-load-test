/**
 * AgriGen ERP - API Soak Test (Endurance Test)
 * 
 * Soak test to verify system stability over extended period.
 * Tests for memory leaks, resource exhaustion, and performance degradation.
 * 
 * Run: k6 run tests/soak/api-soak.js
 * Or: npm run test:soak
 * 
 * Note: This test runs for extended duration (1+ hours)
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { thresholds } from '../../config/thresholds.js';
import { loginAsAdmin, loginAsUser } from '../../utils/auth.js';
import {
    checkResponse,
    authHeader,
    randomSleep,
    generateSalesOrder,
    generateInventoryItem
} from '../../utils/helpers.js';

export const options = {
    stages: [
        { duration: '5m', target: 15 },   // Ramp up
        { duration: '60m', target: 15 },  // Maintain load for 1 hour
        { duration: '5m', target: 0 },    // Ramp down
    ],
    thresholds: thresholds.standard,
    tags: {
        test_type: 'soak',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

export function setup() {
    console.log('Starting soak test setup...');
    const token = loginAsAdmin();

    if (!token) {
        throw new Error('Failed to authenticate during setup');
    }

    return { token };
}

export default function (data) {
    const { token } = data;

    // Periodically re-login to test token refresh over time
    let userToken = token;
    if (__ITER % 50 === 0) {
        userToken = loginAsUser() || token;
    }

    const headers = authHeader(userToken);

    // Realistic user workflow
    group('Sustained Operations', () => {
        // Regular inventory checks
        const inventoryResponse = http.get(
            `${baseUrl}${config.endpoints.inventory.list}`,
            { headers }
        );

        checkResponse(inventoryResponse, 200, 'inventory list stable');

        randomSleep(1, 2);

        // Periodic sales creation
        if (__ITER % 5 === 0) {
            const salesData = generateSalesOrder();
            const salesResponse = http.post(
                `${baseUrl}${config.endpoints.sales.create}`,
                JSON.stringify(salesData),
                { headers }
            );

            checkResponse(salesResponse, 201, 'sales creation stable');
        }

        randomSleep(2, 3);

        // Regular report generation
        if (__ITER % 10 === 0) {
            const reportResponse = http.get(
                `${baseUrl}${config.endpoints.reports.sales}`,
                { headers }
            );

            checkResponse(reportResponse, 200, 'report generation stable');
        }

        randomSleep(1, 2);

        // Account balance checks
        if (__ITER % 7 === 0) {
            const balanceResponse = http.get(
                `${baseUrl}${config.endpoints.accounts.balance}`,
                { headers }
            );

            checkResponse(balanceResponse, 200, 'account balance stable');
        }
    });

    sleep(2);
}

export function teardown(data) {
    console.log('Soak test completed - Check for memory leaks and resource exhaustion');
}
