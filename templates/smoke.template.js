/**
 * API Smoke Test Template
 * 
 * Quick validation test to verify that critical API endpoints are working.
 * Runs with minimal load (1-2 VUs) to catch breaking changes early.
 * 
 * USAGE:
 * 1. Copy this file to tests/smoke/your-api-smoke.js
 * 2. Update the endpoint groups with your actual API endpoints
 * 3. Configure thresholds for your expected response times
 * 4. Run: k6 run -e ENVIRONMENT=dev tests/smoke/your-api-smoke.js
 * 
 * CUSTOMIZATION POINTS:
 * - Update options.vus and options.duration for your smoke test needs
 * - Replace group() blocks with your API endpoint groups
 * - Add custom validation logic in checkResponse calls
 * - Modify sleep() durations between requests
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../config/env.js';
import { thresholds } from '../config/thresholds.js';
import { loginAsAdmin } from '../utils/auth.js';
import { checkResponse, parseJSON, authHeader } from '../utils/helpers.js';

// Test configuration
export const options = {
    vus: 1,                           // Number of virtual users
    duration: '30s',                   // Test duration
    thresholds: thresholds.standard,   // Performance thresholds from config
    tags: {
        test_type: 'smoke',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

/**
 * Setup function - runs once at the start
 * Use this to authenticate and prepare data for all VUs
 */
export function setup() {
    console.log('🚀 Starting Smoke Test Setup...');
    
    // Authenticate once and share token with all VUs
    const token = loginAsAdmin();
    if (!token) {
        throw new Error('❌ Failed to authenticate during setup');
    }
    
    console.log('✓ Authentication successful');
    return { token };
}

/**
 * Main test function - runs for each VU iteration
 */
export default function (data) {
    const { token } = data;
    const headers = authHeader(token);

    // ============================================
    // ENDPOINT GROUP 1: Authentication
    // Replace with your first API group
    // ============================================
    group('Authentication APIs', () => {
        const response = http.post(
            `${baseUrl}/api/auth/login`,           // ← UPDATE: Your login endpoint
            JSON.stringify({
                username: config.testUsers.admin.username,
                password: config.testUsers.admin.password
            }),
            { headers: config.headers }
        );

        checkResponse(response, 200, 'login endpoint works');
        
        // Optional: Add custom checks
        check(response, {
            'has token in response': (r) => {
                const body = parseJSON(r);
                return body && (body.token || body.data?.token);
            }
        });
    });

    sleep(1);  // Pause between groups

    // ============================================
    // ENDPOINT GROUP 2: Resource List
    // Replace with your second API group
    // ============================================
    group('Resource List APIs', () => {
        const response = http.get(
            `${baseUrl}/api/resources`,            // ← UPDATE: Your list endpoint
            { headers }
        );

        checkResponse(response, 200, 'resource list works');
        
        // Optional: Validate response structure
        const body = parseJSON(response);
        check(body, {
            'has data array': (b) => b && Array.isArray(b.data || b)
        });
    });

    sleep(1);

    // ============================================
    // ENDPOINT GROUP 3: Resource Create
    // Replace with your third API group
    // ============================================
    group('Resource Create APIs', () => {
        const payload = {
            // ← UPDATE: Your resource creation payload
            name: 'Test Resource',
            description: 'Created by smoke test',
            createdAt: new Date().toISOString()
        };

        const response = http.post(
            `${baseUrl}/api/resources`,            // ← UPDATE: Your create endpoint
            JSON.stringify(payload),
            { headers }
        );

        checkResponse(response, 201, 'resource creation works');
    });

    sleep(1);

    // ============================================
    // ENDPOINT GROUP 4: Resource Details
    // Replace with your fourth API group
    // ============================================
    group('Resource Details APIs', () => {
        const resourceId = 1;                      // ← UPDATE: Use actual resource ID
        
        const response = http.get(
            `${baseUrl}/api/resources/${resourceId}`,  // ← UPDATE: Your details endpoint
            { headers }
        );

        checkResponse(response, 200, 'resource details work');
    });

    sleep(1);

    // ============================================
    // ADD MORE ENDPOINT GROUPS AS NEEDED
    // Copy the group() pattern above
    // ============================================
}

/**
 * Teardown function - runs once at the end
 * Use this to cleanup test data if needed
 */
export function teardown(data) {
    console.log('🧹 Smoke Test Complete');
}

/**
 * NEXT STEPS:
 * 
 * 1. Update config/env.js with your API base URL
 * 2. Update config/thresholds.js with your performance expectations
 * 3. Replace all "← UPDATE:" marked sections with your API details
 * 4. Add more group() blocks for additional endpoint groups
 * 5. Run the test: k6 run -e ENVIRONMENT=dev tests/smoke/your-api-smoke.js
 * 6. Review results and adjust thresholds as needed
 * 
 * See: examples/attendance-api/ for a complete working example
 */
