/**
 * LankemERP - Custom API Smoke Test
 * 
 * Quick smoke test for LankemERP API to verify basic functionality.
 * 
 * Run: k6 run -e ENVIRONMENT=dev tests/smoke/lankem-erp-smoke.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { thresholds } from '../../config/thresholds.js';
import { loginAsAdmin } from '../../utils/auth.js';
import {
    checkResponse,
    parseJSON,
    authHeader
} from '../../utils/helpers.js';

export const options = {
    vus: 1,
    duration: '30s',
    thresholds: thresholds.smoke,
    tags: {
        test_type: 'smoke',
        environment: __ENV.ENVIRONMENT || 'dev',
        api: 'lankem-erp'
    }
};

const baseUrl = config.getBaseUrl();

export default function () {
    // Test 1: Login
    let adminToken;
    group('Authentication', () => {
        adminToken = loginAsAdmin();
        
        check(adminToken, {
            'login successful': (token) => token !== null && token !== undefined,
            'token is string': (token) => typeof token === 'string'
        });
    });

    if (!adminToken) {
        console.error('Authentication failed - skipping remaining tests');
        return;
    }

    const headers = authHeader(adminToken);

    // Test 2: Get Groups
    group('Get Groups', () => {
        const response = http.get(
            `${baseUrl}/api/Group/GetAllGroups`,
            { headers }
        );

        check(response, {
            'groups endpoint works': (r) => r.status === 200,
            'groups response time OK': (r) => r.timings.duration < 1000
        });
    });

    sleep(1);

    // Test 3: Get Factories
    group('Get Factories', () => {
        const response = http.get(
            `${baseUrl}/api/Factory/GetAllFactories`,
            { headers }
        );

        check(response, {
            'factories endpoint works': (r) => r.status === 200,
            'factories response time OK': (r) => r.timings.duration < 1000
        });
    });

    sleep(1);

    // Test 4: Get Estates
    group('Get Estates', () => {
        const response = http.get(
            `${baseUrl}/api/Estate/GetAllEstates`,
            { headers }
        );

        check(response, {
            'estates endpoint works': (r) => r.status === 200,
            'estates response time OK': (r) => r.timings.duration < 1000
        });
    });

    sleep(1);

    // Test 5: Get Banks
    group('Get Banks', () => {
        const response = http.get(
            `${baseUrl}/api/Bank/GetAllBanks`,
            { headers }
        );

        check(response, {
            'banks endpoint works': (r) => r.status === 200,
            'banks response time OK': (r) => r.timings.duration < 1000
        });
    });

    sleep(1);

    // Test 6: Get Employee Categories
    group('Get Employee Categories', () => {
        const response = http.get(
            `${baseUrl}/api/Employee/GetAllEmployeeCategory`,
            { headers }
        );

        check(response, {
            'employee categories endpoint works': (r) => r.status === 200,
            'employee response time OK': (r) => r.timings.duration < 1000
        });
    });

    sleep(1);

    // Test 7: Get Divisions
    group('Get Divisions', () => {
        const response = http.get(
            `${baseUrl}/api/Division/GetAllDivisions`,
            { headers }
        );

        check(response, {
            'divisions endpoint works': (r) => r.status === 200,
            'divisions response time OK': (r) => r.timings.duration < 1000
        });
    });

    sleep(1);

    console.log('Smoke test completed');
}
