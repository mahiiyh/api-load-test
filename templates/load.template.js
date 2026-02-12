/**
 * API Load Test Template
 * 
 * Performance baseline test that simulates normal production load.
 * Gradually ramps up to peak load and maintains it to measure system behavior.
 * 
 * USAGE:
 * 1. Copy this file to tests/load/your-api-load.js
 * 2. Update the endpoint with your actual API endpoint
 * 3. Configure stages for your expected load pattern
 * 4. Run: k6 run -e ENVIRONMENT=dev tests/load/your-api-load.js
 * 
 * CUSTOMIZATION POINTS:
 * - Update options.stages to match your expected traffic patterns
 * - Adjust thresholds for your API's performance requirements
 * - Replace endpoint URLs with your actual API endpoints
 * - Add custom metrics using Trend or Counter if needed
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../config/env.js';
import { thresholds } from '../config/thresholds.js';
import { loginAsAdmin } from '../utils/auth.js';
import { checkResponse, parseJSON, authHeader } from '../utils/helpers.js';

// Load test configuration
export const options = {
    // Simulate realistic load pattern: ramp up -> sustain -> ramp down
    stages: [
        { duration: '2m', target: 10 },   // Ramp up to 10 VUs over 2 minutes
        { duration: '5m', target: 10 },   // Stay at 10 VUs for 5 minutes
        { duration: '2m', target: 20 },   // Ramp up to 20 VUs over 2 minutes
        { duration: '5m', target: 20 },   // Stay at 20 VUs for 5 minutes
        { duration: '2m', target: 0 },    // Ramp down to 0 VUs
    ],
    
    // Performance thresholds
    thresholds: {
        http_req_duration: ['p(95)<2000'],    // 95% of requests under 2s
        http_req_failed: ['rate<0.01'],       // Less than 1% failures
        http_reqs: ['rate>10'],               // At least 10 req/s
    },
    
    tags: {
        test_type: 'load',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

/**
 * Setup function - runs once before all VUs start
 */
export function setup() {
    console.log('🚀 Starting Load Test Setup...');
    console.log(`📊 Target: ${options.stages.map(s => s.target).join(' → ')} VUs`);
    
    // Authenticate once
    const token = loginAsAdmin();
    if (!token) {
        throw new Error('❌ Failed to authenticate during setup');
    }
    
    console.log('✓ Authentication successful');
    return { token };
}

/**
 * Main test function - runs for each VU iteration
 * This represents one user's journey through your API
 */
export default function (data) {
    const { token } = data;
    const headers = authHeader(token);

    // ============================================
    // CRITICAL USER JOURNEY
    // Replace with your most important user flow
    // ============================================
    
    // Step 1: List Resources
    group('List Resources', () => {
        const response = http.get(
            `${baseUrl}/api/resources`,            // ← UPDATE: Your list endpoint
            { headers }
        );

        checkResponse(response, 200, 'list resources successful');
        
        const body = parseJSON(response);
        check(body, {
            'returns data array': (b) => Array.isArray(b.data || b),
            'has at least one item': (b) => (b.data || b).length > 0
        });
    });

    sleep(2);  // Simulate user reading the list

    // Step 2: Get Resource Details
    group('Get Resource Details', () => {
        const resourceId = 1;                      // ← UPDATE: Use actual resource ID
        
        const response = http.get(
            `${baseUrl}/api/resources/${resourceId}`,  // ← UPDATE: Your details endpoint
            { headers }
        );

        checkResponse(response, 200, 'get details successful');
    });

    sleep(3);  // Simulate user reviewing details

    // Step 3: Update Resource
    group('Update Resource', () => {
        const resourceId = 1;                      // ← UPDATE: Use actual resource ID
        const payload = {
            // ← UPDATE: Your update payload
            name: 'Updated by Load Test',
            updatedAt: new Date().toISOString()
        };

        const response = http.put(
            `${baseUrl}/api/resources/${resourceId}`,  // ← UPDATE: Your update endpoint
            JSON.stringify(payload),
            { headers }
        );

        checkResponse(response, 200, 'update successful');
    });

    sleep(5);  // Simulate user thinking time before next action

    // Step 4: Search/Filter Resources
    group('Search Resources', () => {
        const searchParams = 'status=active&limit=20';  // ← UPDATE: Your search params
        
        const response = http.get(
            `${baseUrl}/api/resources?${searchParams}`,  // ← UPDATE: Your search endpoint
            { headers }
        );

        checkResponse(response, 200, 'search successful');
    });

    sleep(2);

    // ============================================
    // ADD MORE USER JOURNEY STEPS AS NEEDED
    // Each step should represent a real user action
    // ============================================
}

/**
 * Teardown function - runs once after all VUs finish
 */
export function teardown(data) {
    console.log('✅ Load Test Complete');
    console.log('📈 Check the output above for performance metrics');
}

/**
 * PERFORMANCE ANALYSIS TIPS:
 * 
 * After running this test, focus on:
 * 
 * 1. Response Time Trends:
 *    - Does performance degrade under sustained load?
 *    - Are there any sudden spikes?
 * 
 * 2. Throughput:
 *    - Can the system handle the expected requests per second?
 *    - Is throughput consistent throughout the test?
 * 
 * 3. Error Rate:
 *    - Are there any errors under normal load?
 *    - Which endpoints fail first?
 * 
 * 4. Resource Utilization:
 *    - Monitor CPU, memory, database connections on your server
 *    - Identify bottlenecks early
 * 
 * NEXT STEPS:
 * 
 * 1. Update all "← UPDATE:" marked sections
 * 2. Adjust stages to match your expected traffic pattern
 * 3. Set realistic thresholds based on SLAs
 * 4. Run test: k6 run -e ENVIRONMENT=dev tests/load/your-api-load.js
 * 5. Analyze results and optimize as needed
 * 
 * See: examples/attendance-api/ for a complete working example
 */
