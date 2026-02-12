/**
 * LankemERP - Custom API Load Test
 * 
 * Load test designed specifically for LankemERP API endpoints.
 * Tests authentication, read operations, and attendance bulk upload.
 * 
 * Run: k6 run -e ENVIRONMENT=dev tests/load/lankem-erp-load.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { thresholds } from '../../config/thresholds.js';
import { loginAsAdmin } from '../../utils/auth.js';
import {
    checkResponse,
    parseJSON,
    authHeader,
    randomSleep,
    randomInt
} from '../../utils/helpers.js';

export const options = {
    stages: [
        { duration: '2m', target: 5 },   // Ramp up to 5 users
        { duration: '5m', target: 5 },   // Stay at 5 users
        { duration: '2m', target: 10 },  // Ramp up to 10 users
        { duration: '5m', target: 10 },  // Stay at 10 users
        { duration: '2m', target: 0 },   // Ramp down to 0
    ],
    thresholds: thresholds.standard,
    tags: {
        test_type: 'load',
        environment: __ENV.ENVIRONMENT || 'dev',
        api: 'lankem-erp'
    }
};

const baseUrl = config.getBaseUrl();

export function setup() {
    console.log('Starting LankemERP load test setup...');
    console.log(`Target API: ${baseUrl}`);
    
    const adminToken = loginAsAdmin();

    if (!adminToken) {
        throw new Error('Failed to authenticate admin during setup');
    }

    console.log('Authentication successful. Starting load test...');
    return { adminToken };
}

export default function (data) {
    const { adminToken } = data;
    const headers = authHeader(adminToken);

    // Scenario 1: Get All Groups (20% of requests)
    if (Math.random() < 0.2) {
        group('Get All Groups', () => {
            const response = http.get(
                `${baseUrl}/api/Group/GetAllGroups`,
                { headers }
            );

            check(response, {
                'groups retrieved': (r) => r.status === 200,
                'groups has data': (r) => {
                    const body = parseJSON(r);
                    return body && body.data && Array.isArray(body.data);
                }
            });
        });

        randomSleep(1, 2);
    }

    // Scenario 2: Get Factories (20% of requests)
    if (Math.random() < 0.2) {
        group('Get Factories', () => {
            const response = http.get(
                `${baseUrl}/api/Factory/GetAllFactories`,
                { headers }
            );

            checkResponse(response, 200, 'factories retrieved');
        });

        randomSleep(1, 2);
    }

    // Scenario 3: Get All Estates (15% of requests)
    if (Math.random() < 0.15) {
        group('Get All Estates', () => {
            const response = http.get(
                `${baseUrl}/api/Estate/GetAllEstates`,
                { headers }
            );

            check(response, {
                'estates retrieved': (r) => r.status === 200,
                'response time OK': (r) => r.timings.duration < 1000
            });
        });

        randomSleep(1, 2);
    }

    // Scenario 4: Get Customer Details (15% of requests)
    if (Math.random() < 0.15) {
        group('Get Customer Details', () => {
            const response = http.get(
                `${baseUrl}/api/Customer/GetAllActiveFunds`,
                { headers }
            );

            checkResponse(response, 200, 'customer data retrieved');
        });

        randomSleep(1, 3);
    }

    // Scenario 5: Get Employee Categories (10% of requests)
    if (Math.random() < 0.1) {
        group('Get Employee Categories', () => {
            const response = http.get(
                `${baseUrl}/api/Employee/GetAllEmployeeCategory`,
                { headers }
            );

            check(response, {
                'employee categories retrieved': (r) => r.status === 200
            });
        });

        randomSleep(1, 2);
    }

    // Scenario 6: Get All Banks (10% of requests)
    if (Math.random() < 0.1) {
        group('Get All Banks', () => {
            const response = http.get(
                `${baseUrl}/api/Bank/GetAllBanks`,
                { headers }
            );

            checkResponse(response, 200, 'banks retrieved');
        });

        randomSleep(1, 2);
    }

    // Scenario 7: Get Division Details (10% of requests)
    if (Math.random() < 0.1) {
        group('Get All Divisions', () => {
            const response = http.get(
                `${baseUrl}/api/Division/GetAllDivisions`,
                { headers }
            );

            check(response, {
                'divisions retrieved': (r) => r.status === 200,
                'has valid response': (r) => {
                    const body = parseJSON(r);
                    return body !== null;
                }
            });
        });

        randomSleep(1, 2);
    }

    // Random sleep between scenarios
    randomSleep(2, 5);
}

export function teardown(data) {
    console.log('LankemERP load test completed');
}
