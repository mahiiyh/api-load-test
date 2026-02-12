/**
 * AgriGen ERP - Attendance Bulk Upload Load Test
 * 
 * Load test for the Plucking Checkroll Attendance Bulk Upload API.
 * Simulates realistic bulk upload scenarios with varying employee counts.
 * 
 * API: http://20.198.232.178:8170/swagger/api/CheckrollAttendanceBulkUpload/SavePluckingCheckrollAttendanceBulkUpload
 * 
 * Run: k6 run tests/load/attendance-bulk-upload-load.js
 * Or: npm run test:attendance-load
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../../config/env.js';
import { thresholds } from '../../../config/thresholds.js';
import {
    checkResponse,
    parseJSON,
    randomInt,
    randomSleep,
    log
} from '../../../utils/helpers.js';
import {
    generateBulkAttendanceData,
    generateRealisticAttendance
} from '../utils/attendance-helpers.js';

export const options = {
    stages: [
        { duration: '2m', target: 5 },   // Ramp up to 5 users
        { duration: '5m', target: 5 },   // Stay at 5 users
        { duration: '2m', target: 10 },  // Ramp up to 10 users
        { duration: '5m', target: 10 },  // Stay at 10 users
        { duration: '2m', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<3000', 'p(99)<5000'], // Relaxed for bulk operations
        http_req_failed: ['rate<0.02'], // Less than 2% errors
        'http_req_duration{scenario:small_batch}': ['p(95)<2000'],
        'http_req_duration{scenario:medium_batch}': ['p(95)<3000'],
        'http_req_duration{scenario:large_batch}': ['p(95)<5000'],
    },
    tags: {
        test_type: 'load',
        api: 'attendance_bulk_upload',
        environment: __ENV.ENVIRONMENT || 'agrigen_api'
    }
};

const baseUrl = config.getBaseUrl();
const endpoint = config.endpoints.attendance.bulkUpload;

export function setup() {
    log('Starting Attendance Bulk Upload Load Test...', 'info');
    log(`Target API: ${baseUrl}${endpoint}`, 'info');

    return {
        baseUrl: baseUrl,
        endpoint: endpoint,
        startTime: new Date().toISOString()
    };
}

export default function (data) {
    const { baseUrl, endpoint } = data;
    const url = `${baseUrl}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // Scenario distribution
    const rand = Math.random();
    let recordCount;
    let scenarioTag;

    if (rand < 0.4) {
        // 40% - Small batches (1-10 records)
        recordCount = randomInt(1, 10);
        scenarioTag = 'small_batch';
    } else if (rand < 0.8) {
        // 40% - Medium batches (11-50 records)
        recordCount = randomInt(11, 50);
        scenarioTag = 'medium_batch';
    } else {
        // 20% - Large batches (51-100 records)
        recordCount = randomInt(51, 100);
        scenarioTag = 'large_batch';
    }

    group(`Upload ${scenarioTag} (${recordCount} records)`, () => {
        // Generate realistic attendance data
        const attendanceData = generateRealisticAttendance(recordCount);
        const payload = JSON.stringify(attendanceData);

        log(`Uploading ${recordCount} attendance records...`, 'info');

        const response = http.post(url, payload, {
            headers: headers,
            tags: { scenario: scenarioTag }
        });

        // Check response
        const checkResult = check(response, {
            'status is 200': (r) => r.status === 200,
            'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
            'response time OK': (r) => r.timings.duration < 5000,
            'has response body': (r) => r.body && r.body.length > 0,
        });

        if (!checkResult) {
            log(`Failed to upload ${recordCount} records. Status: ${response.status}`, 'error');
            if (response.body) {
                log(`Response: ${response.body.substring(0, 200)}`, 'error');
            }
        } else {
            log(`Successfully uploaded ${recordCount} records in ${response.timings.duration}ms`, 'info');
        }

        // Parse response for validation
        const body = parseJSON(response);
        if (body) {
            check(body, {
                'response is object or array': (b) => typeof b === 'object',
            });
        }
    });

    // Think time between uploads
    randomSleep(2, 5);
}

export function teardown(data) {
    const endTime = new Date().toISOString();
    log('Attendance Bulk Upload Load Test Completed', 'info');
    log(`Start Time: ${data.startTime}`, 'info');
    log(`End Time: ${endTime}`, 'info');
}
