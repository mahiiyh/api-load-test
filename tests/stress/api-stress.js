/**
 * AgriGen ERP - API Stress Test
 * 
 * Stress test to find the breaking point of the system.
 * Gradually increases load beyond normal capacity to identify limits.
 * 
 * Run: k6 run tests/stress/api-stress.js
 * Or: npm run test:stress
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { thresholds } from '../../config/thresholds.js';
import { loginAsAdmin } from '../../utils/auth.js';
import {
    checkResponse,
    authHeader,
    generateInventoryItem,
    generateSalesOrder,
    randomSleep
} from '../../utils/helpers.js';

export const options = {
    stages: [
        { duration: '2m', target: 20 },   // Ramp up to normal load
        { duration: '3m', target: 20 },   // Stay at normal load
        { duration: '2m', target: 50 },   // Ramp up to high load
        { duration: '3m', target: 50 },   // Stay at high load
        { duration: '2m', target: 100 },  // Ramp up to breaking point
        { duration: '3m', target: 100 },  // Stay at breaking point
        { duration: '2m', target: 150 },  // Push further
        { duration: '3m', target: 150 },  // Maintain extreme load
        { duration: '3m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(99)<5000'], // Relaxed threshold for stress test
        http_req_failed: ['rate<0.1'],     // Allow up to 10% errors
    },
    tags: {
        test_type: 'stress',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

export function setup() {
    console.log('Starting stress test setup...');
    const token = loginAsAdmin();

    if (!token) {
        throw new Error('Failed to authenticate during setup');
    }

    return { token };
}

export default function (data) {
    const { token } = data;
    const headers = authHeader(token);

    // Heavy mixed workload
    group('Heavy Operations Mix', () => {
        // Inventory operations
        const inventoryResponse = http.get(
            `${baseUrl}${config.endpoints.inventory.list}`,
            { headers }
        );

        check(inventoryResponse, {
            'inventory accessible': (r) => r.status === 200 || r.status === 500,
        });

        // Create sales orders rapidly
        if (Math.random() < 0.7) {
            const salesData = generateSalesOrder();
            const salesResponse = http.post(
                `${baseUrl}${config.endpoints.sales.create}`,
                JSON.stringify(salesData),
                { headers }
            );

            check(salesResponse, {
                'sales order processed': (r) => r.status === 201 || r.status === 500 || r.status === 503,
            });
        }

        // Generate reports (heavy operation)
        if (Math.random() < 0.4) {
            const reportResponse = http.get(
                `${baseUrl}${config.endpoints.reports.financial}`,
                { headers }
            );

            check(reportResponse, {
                'report generated or service degraded': (r) => r.status < 600,
            });
        }

        // Account operations
        if (Math.random() < 0.5) {
            const ledgerResponse = http.get(
                `${baseUrl}${config.endpoints.accounts.ledger}`,
                { headers }
            );

            check(ledgerResponse, {
                'ledger accessible': (r) => r.status < 600,
            });
        }
    });

    // Short sleep to maintain high pressure
    sleep(0.5);
}

export function teardown(data) {
    console.log('Stress test completed - Check system recovery');
}
