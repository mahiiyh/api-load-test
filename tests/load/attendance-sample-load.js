/**
 * LankemERP - Attendance Bulk Upload Load Test (Sample Data)
 * 
 * Load test for the Plucking Checkroll Attendance Bulk Upload API.
 * Uses actual sample data files with 10, 50, and 100 records.
 * 
 * API: /api/CheckrollAttendanceBulkUpload/SavePluckingCheckrollAttendanceBulkUpload
 * 
 * Run: k6 run -e ENVIRONMENT=dev tests/load/attendance-sample-load.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { loginAsAdmin } from '../../utils/auth.js';
import {
    parseJSON,
    randomInt,
    authHeader
} from '../../utils/helpers.js';

// Load sample data files
const sample10 = JSON.parse(open('../../sample-data/attendance-sample-10.json'));
const sample50 = JSON.parse(open('../../sample-data/attendance-sample-50.json'));
const sample100 = JSON.parse(open('../../sample-data/attendance-sample-100.json'));

export const options = {
    stages: [
        { duration: '1m', target: 2 },   // Ramp up to 2 users
        { duration: '3m', target: 2 },   // Stay at 2 users
        { duration: '1m', target: 5 },   // Ramp up to 5 users
        { duration: '3m', target: 5 },   // Stay at 5 users
        { duration: '1m', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<3000', 'p(99)<5000'],
        http_req_failed: ['rate<0.05'], // Less than 5% errors
        'http_req_duration{size:10}': ['p(95)<2000'],
        'http_req_duration{size:50}': ['p(95)<3000'],
        'http_req_duration{size:100}': ['p(95)<5000'],
    },
    tags: {
        test_type: 'load',
        api: 'attendance_bulk_upload',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();
const endpoint = '/api/CheckrollAttendanceBulkUpload/SavePluckingCheckrollAttendanceBulkUpload';

export function setup() {
    console.log('===========================================');
    console.log('Attendance Bulk Upload Load Test (Sample Data)');
    console.log('===========================================');
    console.log(`Target API: ${baseUrl}${endpoint}`);
    console.log(`Sample Data: 10, 50, and 100 records`);
    console.log('');
    
    const adminToken = loginAsAdmin();

    if (!adminToken) {
        throw new Error('Failed to authenticate admin during setup');
    }

    console.log('Authentication successful. Starting load test...');
    console.log('');

    return {
        adminToken,
        startTime: new Date().toISOString()
    };
}

export default function (data) {
    const { adminToken } = data;
    const url = `${baseUrl}${endpoint}`;
    const headers = {
        ...authHeader(adminToken),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // Randomly select a sample size based on realistic distribution
    const rand = Math.random();
    let sampleData;
    let sizeTag;

    if (rand < 0.5) {
        // 50% - Small batch (10 records)
        sampleData = sample10;
        sizeTag = '10';
    } else if (rand < 0.85) {
        // 35% - Medium batch (50 records)
        sampleData = sample50;
        sizeTag = '50';
    } else {
        // 15% - Large batch (100 records)
        sampleData = sample100;
        sizeTag = '100';
    }

    group(`Upload ${sizeTag} records`, () => {
        // Update collected date to current date for each request
        const currentDate = new Date().toISOString();
        const attendanceData = sampleData.map(record => ({
            ...record,
            collectedDate: currentDate
        }));

        const payload = JSON.stringify(attendanceData);

        console.log(`[${new Date().toISOString()}] Uploading ${sizeTag} attendance records...`);

        const response = http.post(url, payload, {
            headers: headers,
            tags: { size: sizeTag }
        });

        const success = check(response, {
            'status is 200': (r) => r.status === 200,
            'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
            'response time OK': (r) => r.timings.duration < 5000,
            'has response body': (r) => r.body && r.body.length > 0
        });

        if (!success) {
            console.error(`[${new Date().toISOString()}] Failed to upload ${sizeTag} records. Status: ${response.status}`);
            if (response.body) {
                const body = parseJSON(response);
                if (body) {
                    console.error(`Response: ${JSON.stringify(body).substring(0, 200)}`);
                }
            }
        } else {
            console.log(`[${new Date().toISOString()}] Successfully uploaded ${sizeTag} records`);
        }
    });

    // Wait between requests - simulate realistic user behavior
    sleep(randomInt(2, 5));
}

export function teardown(data) {
    const { startTime } = data;
    console.log('');
    console.log('===========================================');
    console.log('Attendance Bulk Upload Load Test Completed');
    console.log('===========================================');
    console.log(`Start Time: ${startTime}`);
    console.log(`End Time: ${new Date().toISOString()}`);
}
