/**
 * AgriGen ERP - API Smoke Test
 * 
 * Quick validation test to verify that all critical API endpoints are working.
 * This test runs with minimal load (1-2 VUs) to catch breaking changes early.
 * 
 * Run: k6 run tests/smoke/api-smoke.js
 * Or: npm run test:smoke
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { thresholds } from '../../config/thresholds.js';
import { loginAsAdmin } from '../../utils/auth.js';
import { checkResponse, parseJSON, authHeader } from '../../utils/helpers.js';

export const options = {
    vus: 1,
    duration: '30s',
    thresholds: thresholds.standard,
    tags: {
        test_type: 'smoke',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

export function setup() {
    // Login once and get token for all VUs
    const token = loginAsAdmin();
    if (!token) {
        throw new Error('Failed to authenticate during setup');
    }
    return { token };
}

export default function (data) {
    const { token } = data;
    const headers = authHeader(token);

    // Test Authentication APIs
    group('Authentication APIs', () => {
        const loginResponse = http.post(
            `${baseUrl}${config.endpoints.auth.login}`,
            JSON.stringify(config.testUsers.user),
            { headers: config.headers }
        );

        checkResponse(loginResponse, 200, 'login endpoint works');
    });

    sleep(1);

    // Test Inventory APIs
    group('Inventory APIs', () => {
        const inventoryResponse = http.get(
            `${baseUrl}${config.endpoints.inventory.list}`,
            { headers }
        );

        checkResponse(inventoryResponse, 200, 'inventory list works');

        const body = parseJSON(inventoryResponse);
        check(body, {
            'inventory has data': (b) => b && Array.isArray(b.data || b)
        });
    });

    sleep(1);

    // Test Sales APIs
    group('Sales APIs', () => {
        const salesResponse = http.get(
            `${baseUrl}${config.endpoints.sales.list}`,
            { headers }
        );

        checkResponse(salesResponse, 200, 'sales list works');
    });

    sleep(1);

    // Test Purchase APIs
    group('Purchase APIs', () => {
        const purchaseResponse = http.get(
            `${baseUrl}${config.endpoints.purchase.list}`,
            { headers }
        );

        checkResponse(purchaseResponse, 200, 'purchase list works');
    });

    sleep(1);

    // Test Accounts APIs
    group('Accounts APIs', () => {
        const ledgerResponse = http.get(
            `${baseUrl}${config.endpoints.accounts.ledger}`,
            { headers }
        );

        checkResponse(ledgerResponse, 200, 'ledger endpoint works');
    });

    sleep(1);

    // Test Reports APIs
    group('Reports APIs', () => {
        const salesReportResponse = http.get(
            `${baseUrl}${config.endpoints.reports.sales}`,
            { headers }
        );

        checkResponse(salesReportResponse, 200, 'sales report works');
    });

    sleep(1);
}

export function teardown(data) {
    // Cleanup if needed
    console.log('Smoke test completed');
}
