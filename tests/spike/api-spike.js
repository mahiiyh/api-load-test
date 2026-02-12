/**
 * AgriGen ERP - API Spike Test
 * 
 * Spike test to verify system behavior under sudden extreme load.
 * Tests if the system can handle sudden traffic spikes and recover.
 * 
 * Run: k6 run tests/spike/api-spike.js
 * Or: npm run test:spike
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { loginAsAdmin } from '../../utils/auth.js';
import { checkResponse, authHeader, generateSalesOrder } from '../../utils/helpers.js';

export const options = {
    stages: [
        { duration: '30s', target: 10 },   // Normal load
        { duration: '1m', target: 10 },    // Stay at normal
        { duration: '10s', target: 200 },  // SPIKE! Sudden extreme load
        { duration: '2m', target: 200 },   // Maintain spike
        { duration: '10s', target: 10 },   // Drop back to normal
        { duration: '1m', target: 10 },    // Recovery period
        { duration: '30s', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(99)<10000'], // Very relaxed during spike
        http_req_failed: ['rate<0.2'],      // Allow up to 20% errors during spike
    },
    tags: {
        test_type: 'spike',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

export function setup() {
    console.log('Starting spike test setup...');
    const token = loginAsAdmin();

    if (!token) {
        throw new Error('Failed to authenticate during setup');
    }

    return { token };
}

export default function (data) {
    const { token } = data;
    const headers = authHeader(token);

    group('Spike Test Operations', () => {
        // Critical read operation
        const inventoryResponse = http.get(
            `${baseUrl}${config.endpoints.inventory.list}`,
            { headers }
        );

        check(inventoryResponse, {
            'inventory endpoint responds': (r) => r.status < 600,
            'inventory within tolerance': (r) => r.status === 200 || r.status === 503,
        });

        // Critical write operation
        if (Math.random() < 0.5) {
            const salesData = generateSalesOrder();
            const salesResponse = http.post(
                `${baseUrl}${config.endpoints.sales.create}`,
                JSON.stringify(salesData),
                { headers }
            );

            check(salesResponse, {
                'sales endpoint responds': (r) => r.status < 600,
                'sales processed or queued': (r) => r.status === 201 || r.status === 503,
            });
        }
    });

    sleep(0.3);
}

export function teardown(data) {
    console.log('Spike test completed - Verify system recovery and stability');
}
