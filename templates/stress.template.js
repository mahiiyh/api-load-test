/**
 * API Stress Test Template
 * 
 * Tests system behavior under extreme load beyond normal capacity.
 * Identifies breaking points and how the system recovers from high stress.
 * 
 * USAGE:
 * 1. Copy this file to tests/stress/your-api-stress.js
 * 2. Update the endpoint with your actual API endpoint
 * 3. Configure stages to push beyond your expected capacity
 * 4. Run: k6 run -e ENVIRONMENT=dev tests/stress/your-api-stress.js
 * 
 * ⚠️  WARNING:
 * - Run stress tests in isolated/staging environments, NOT production
 * - Coordinate with your infrastructure team before running
 * - Monitor system resources during the test
 * - Have a recovery plan ready
 * 
 * CUSTOMIZATION POINTS:
 * - Adjust stages to gradually increase stress beyond normal capacity
 * - Set thresholds to more lenient values (system is expected to struggle)
 * - Focus on critical endpoints that handle high traffic
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../config/env.js';
import { loginAsAdmin } from '../utils/auth.js';
import { checkResponse, parseJSON, authHeader } from '../utils/helpers.js';

// Stress test configuration - pushes system to its limits
export const options = {
    stages: [
        { duration: '2m', target: 50 },    // Ramp up to normal load
        { duration: '3m', target: 50 },    // Sustain normal load
        { duration: '2m', target: 100 },   // Increase to high load
        { duration: '3m', target: 100 },   // Sustain high load
        { duration: '2m', target: 200 },   // Push to extreme load
        { duration: '3m', target: 200 },   // Sustain extreme load (breaking point)
        { duration: '2m', target: 300 },   // Push even further
        { duration: '3m', target: 300 },   // Sustain maximum stress
        { duration: '5m', target: 0 },     // Ramp down and observe recovery
    ],
    
    // Lenient thresholds - we expect degradation under stress
    thresholds: {
        http_req_duration: ['p(95)<5000'],     // 95% under 5s (lenient)
        http_req_failed: ['rate<0.10'],        // Less than 10% failures
        http_reqs: ['rate>20'],                // Maintain at least 20 req/s
    },
    
    tags: {
        test_type: 'stress',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

/**
 * Setup function
 */
export function setup() {
    console.log('⚠️  Starting Stress Test - System will be pushed to limits!');
    console.log(`📊 Peak Load: ${Math.max(...options.stages.map(s => s.target))} VUs`);
    console.log('🔍 Monitor system resources closely during test');
    
    const token = loginAsAdmin();
    if (!token) {
        throw new Error('❌ Failed to authenticate');
    }
    
    return { token };
}

/**
 * Main stress test function
 * Focus on the most critical/heavy endpoints
 */
export default function (data) {
    const { token } = data;
    const headers = authHeader(token);

    // ============================================
    // MOST CRITICAL ENDPOINT
    // Test your highest-traffic or most resource-intensive endpoint
    // ============================================
    group('Critical Endpoint Stress Test', () => {
        const response = http.post(
            `${baseUrl}/api/critical-operation`,   // ← UPDATE: Your critical endpoint
            JSON.stringify({
                // ← UPDATE: Your payload
                data: 'stress test data',
                timestamp: new Date().toISOString()
            }),
            { headers }
        );

        // Under stress, we're more lenient with validation
        check(response, {
            'status is not 5xx': (r) => r.status < 500,  // Server didn't crash
            'responded within timeout': (r) => r.timings.duration < 10000,  // Under 10s
        });
        
        // Log errors for analysis
        if (response.status !== 200) {
            console.log(`❌ Request failed: ${response.status} - ${response.body}`);
        }
    });

    // Minimal sleep - we want to push the system
    sleep(0.5);

    // ============================================
    // SECONDARY CRITICAL ENDPOINT
    // Add another high-priority endpoint
    // ============================================
    group('Secondary Critical Endpoint', () => {
        const response = http.get(
            `${baseUrl}/api/high-traffic-endpoint`,  // ← UPDATE: Your endpoint
            { headers }
        );

        check(response, {
            'did not timeout': (r) => r.timings.duration < 10000,
            'server responded': (r) => r.status > 0,
        });
    });

    sleep(0.5);

    // ============================================
    // DATABASE-HEAVY OPERATION (Optional)
    // Test endpoints that stress the database
    // ============================================
    group('Database-Heavy Operation', () => {
        const response = http.get(
            `${baseUrl}/api/complex-query?limit=1000`,  // ← UPDATE: Your endpoint
            { headers }
        );

        check(response, {
            'completed': (r) => r.status < 500,
        });
    });

    sleep(1);
}

/**
 * Teardown function
 */
export function teardown(data) {
    console.log('⚠️  Stress Test Complete');
    console.log('🔍 Analysis Points:');
    console.log('   1. At what VU count did errors start appearing?');
    console.log('   2. Did response times increase linearly or exponentially?');
    console.log('   3. How long did recovery take after ramp down?');
    console.log('   4. Were there any cascading failures?');
    console.log('   5. Did the system remain stable or crash?');
}

/**
 * STRESS TEST ANALYSIS GUIDE:
 * 
 * Key Metrics to Analyze:
 * 
 * 1. BREAKING POINT:
 *    - At what load level did errors first appear?
 *    - What was the error rate at peak load?
 *    - Which endpoints failed first?
 * 
 * 2. RESPONSE TIME DEGRADATION:
 *    - How did response times change under stress?
 *    - Was degradation gradual or sudden?
 *    - Did any endpoints maintain good performance?
 * 
 * 3. RECOVERY:
 *    - How quickly did the system recover after stress?
 *    - Were there any lingering issues after test completion?
 *    - Did all services come back online?
 * 
 * 4. ERROR PATTERNS:
 *    - What types of errors occurred? (timeouts, 500s, connection failures)
 *    - Were errors consistent or sporadic?
 *    - Did errors cascade across services?
 * 
 * 5. SYSTEM RESOURCES:
 *    - Monitor CPU, memory, disk I/O, network during test
 *    - Which resource maxed out first?
 *    - Were there any resource leaks?
 * 
 * Optimization Strategies Based on Results:
 * 
 * - If CPU maxed out: Optimize algorithms, add caching, scale horizontally
 * - If memory maxed out: Fix memory leaks, add pagination, use streaming
 * - If database struggled: Add indexes, use connection pooling, implement caching
 * - If network saturated: Compress responses, use CDN, optimize payload size
 * - If errors cascaded: Implement circuit breakers, add rate limiting, improve timeouts
 * 
 * NEXT STEPS:
 * 
 * 1. Update all "← UPDATE:" marked sections
 * 2. Coordinate with infrastructure team
 * 3. Run in staging environment first
 * 4. Monitor system resources during test
 * 5. Document breaking points found
 * 6. Create optimization plan based on results
 * 
 * See: examples/attendance-api/ for a complete working example
 */
