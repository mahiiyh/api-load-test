/**
 * Performance Thresholds Configuration
 * 
 * Define acceptable performance criteria for different test types.
 * Tests will fail if these thresholds are not met.
 */

export const thresholds = {
    // Standard thresholds for most API tests
    standard: {
        http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% under 500ms, 99% under 1s
        http_req_failed: ['rate<0.01'], // Less than 1% errors
        http_reqs: ['rate>10'], // At least 10 requests per second
    },

    // Strict thresholds for critical APIs
    strict: {
        http_req_duration: ['p(95)<300', 'p(99)<600'], // 95% under 300ms, 99% under 600ms
        http_req_failed: ['rate<0.005'], // Less than 0.5% errors
        http_reqs: ['rate>20'], // At least 20 requests per second
    },

    // Relaxed thresholds for heavy operations
    relaxed: {
        http_req_duration: ['p(95)<2000', 'p(99)<5000'], // 95% under 2s, 99% under 5s
        http_req_failed: ['rate<0.05'], // Less than 5% errors
        http_reqs: ['rate>5'], // At least 5 requests per second
    },

    // Report generation thresholds
    reports: {
        http_req_duration: ['p(95)<3000', 'p(99)<10000'], // 95% under 3s, 99% under 10s
        http_req_failed: ['rate<0.02'], // Less than 2% errors
    },

    // Authentication thresholds
    auth: {
        http_req_duration: ['p(95)<400', 'p(99)<800'], // 95% under 400ms, 99% under 800ms
        http_req_failed: ['rate<0.001'], // Less than 0.1% errors
    }
};

export default thresholds;
