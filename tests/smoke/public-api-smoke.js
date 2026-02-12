/**
 * JSONPlaceholder API - Smoke Test
 * 
 * Quick validation test for the public JSONPlaceholder demo API.
 * Tests basic CRUD operations on posts, users, and comments.
 * 
 * API: https://jsonplaceholder.typicode.com
 * 
 * Run: k6 run -e ENVIRONMENT=public_demo tests/smoke/public-api-smoke.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { thresholds } from '../../config/thresholds.js';
import { checkResponse, parseJSON } from '../../utils/helpers.js';

// Test configuration
export const options = {
    vus: 2,                           // 2 virtual users for smoke test
    duration: '30s',                  // Run for 30 seconds
    thresholds: {
        http_req_duration: ['p(95)<2000'],  // 95% requests under 2s
        http_req_failed: ['rate<0.01'],     // Less than 1% failures
    },
    tags: {
        test_type: 'smoke',
        api: 'jsonplaceholder',
        environment: __ENV.ENVIRONMENT || 'public_demo'
    }
};

const baseUrl = config.getBaseUrl();
const headers = config.headers;

/**
 * Setup function - runs once at the start
 */
export function setup() {
    console.log('🚀 Starting JSONPlaceholder API Smoke Test...');
    console.log(`📍 Target: ${baseUrl}`);
    console.log('ℹ️  This API requires no authentication');
    return { baseUrl };
}

/**
 * Main test function - runs for each VU iteration
 */
export default function (data) {
    const { baseUrl } = data;

    // ============================================
    // TEST GROUP 1: List Posts
    // ============================================
    group('List Posts', () => {
        const response = http.get(
            `${baseUrl}${config.endpoints.public_demo.posts}`,
            { headers }
        );

        checkResponse(response, 200, 'posts list endpoint works');
        
        const body = parseJSON(response);
        check(body, {
            'has posts array': (b) => Array.isArray(b),
            'posts array not empty': (b) => b.length > 0,
            'post has required fields': (b) => b[0]?.userId && b[0]?.id && b[0]?.title
        });

        console.log(`✓ Retrieved ${body.length} posts`);
    });

    sleep(1);

    // ============================================
    // TEST GROUP 2: Get Single Post
    // ============================================
    group('Get Single Post', () => {
        const postId = 1;
        const response = http.get(
            `${baseUrl}${config.endpoints.public_demo.posts}/${postId}`,
            { headers }
        );

        checkResponse(response, 200, 'get single post works');
        
        const body = parseJSON(response);
        check(body, {
            'post has userId': (b) => b.userId === 1,
            'post has correct id': (b) => b.id === postId,
            'post has title': (b) => b.title && b.title.length > 0,
            'post has body': (b) => b.body && b.body.length > 0
        });
    });

    sleep(1);

    // ============================================
    // TEST GROUP 3: Create Post
    // ============================================
    group('Create Post', () => {
        const newPost = {
            title: 'Test Post from k6 Load Test',
            body: 'This is a test post created by k6 smoke test',
            userId: 1
        };

        const response = http.post(
            `${baseUrl}${config.endpoints.public_demo.posts}`,
            JSON.stringify(newPost),
            { headers }
        );

        checkResponse(response, 201, 'post creation works');
        
        const body = parseJSON(response);
        check(body, {
            'created post has id': (b) => b.id > 0,
            'created post has title': (b) => b.title === newPost.title,
            'created post has body': (b) => b.body === newPost.body
        });

        console.log(`✓ Created post with ID: ${body.id}`);
    });

    sleep(1);

    // ============================================
    // TEST GROUP 4: List Users
    // ============================================
    group('List Users', () => {
        const response = http.get(
            `${baseUrl}${config.endpoints.public_demo.users}`,
            { headers }
        );

        checkResponse(response, 200, 'users list endpoint works');
        
        const body = parseJSON(response);
        check(body, {
            'has users array': (b) => Array.isArray(b),
            'users array not empty': (b) => b.length > 0,
            'user has required fields': (b) => b[0]?.id && b[0]?.name && b[0]?.email
        });

        console.log(`✓ Retrieved ${body.length} users`);
    });

    sleep(1);

    // ============================================
    // TEST GROUP 5: List Comments
    // ============================================
    group('List Comments', () => {
        const response = http.get(
            `${baseUrl}${config.endpoints.public_demo.comments}?postId=1`,
            { headers }
        );

        checkResponse(response, 200, 'comments list endpoint works');
        
        const body = parseJSON(response);
        check(body, {
            'has comments array': (b) => Array.isArray(b),
            'comments array not empty': (b) => b.length > 0,
            'comment has required fields': (b) => b[0]?.postId && b[0]?.email && b[0]?.body
        });

        console.log(`✓ Retrieved ${body.length} comments for post 1`);
    });

    sleep(1);
}

/**
 * Teardown function - runs once at the end
 */
export function teardown(data) {
    console.log('✅ JSONPlaceholder API Smoke Test Complete');
    console.log('📊 All endpoint groups tested successfully');
    console.log('ℹ️  Note: JSONPlaceholder is a fake API - POST/PUT/DELETE don\'t persist data');
}
