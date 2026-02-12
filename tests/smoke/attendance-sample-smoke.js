/**
 * LankemERP - Attendance Bulk Upload Smoke Test (Sample Data)
 * 
 * Quick smoke test for Attendance Bulk Upload API.
 * Tests all three sample file sizes sequentially.
 * 
 * Run: k6 run -e ENVIRONMENT=dev tests/smoke/attendance-sample-smoke.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { loginAsAdmin } from '../../utils/auth.js';
import {
    parseJSON,
    authHeader
} from '../../utils/helpers.js';

// Load sample data files
const sample10 = JSON.parse(open('../../sample-data/attendance-sample-10.json'));
const sample50 = JSON.parse(open('../../sample-data/attendance-sample-50.json'));
const sample100 = JSON.parse(open('../../sample-data/attendance-sample-100.json'));

export const options = {
    vus: 1,
    iterations: 3, // Run 3 iterations (one for each sample size)
    thresholds: {
        http_req_duration: ['p(95)<5000'],
        http_req_failed: ['rate<0.1'],
    },
    tags: {
        test_type: 'smoke',
        api: 'attendance_bulk_upload',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();
const endpoint = '/api/CheckrollAttendanceBulkUpload/SavePluckingCheckrollAttendanceBulkUpload';

export function setup() {
    console.log('===========================================');
    console.log('Attendance Bulk Upload Smoke Test');
    console.log('===========================================');
    console.log(`Target API: ${baseUrl}${endpoint}`);
    console.log('');
    
    const adminToken = loginAsAdmin();

    if (!adminToken) {
        throw new Error('Failed to authenticate admin during setup');
    }

    console.log('✓ Authentication successful');
    console.log('');
    console.log('Testing all sample file sizes...');
    console.log('');

    return { adminToken };
}

export default function (data) {
    const { adminToken } = data;
    const url = `${baseUrl}${endpoint}`;
    const headers = {
        ...authHeader(adminToken),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const samples = [
        { data: sample10, name: '10 records', size: '10' },
        { data: sample50, name: '50 records', size: '50' },
        { data: sample100, name: '100 records', size: '100' }
    ];

    // Test each sample size
    samples.forEach((sample, index) => {
        group(`Test ${index + 1}: Upload ${sample.name}`, () => {
            // Update collected date to current date
            const currentDate = new Date().toISOString();
            const attendanceData = sample.data.map(record => ({
                ...record,
                collectedDate: currentDate
            }));

            const payload = JSON.stringify(attendanceData);

            console.log(`→ Uploading ${sample.name}...`);

            const response = http.post(url, payload, {
                headers: headers,
                tags: { size: sample.size }
            });

            const success = check(response, {
                [`${sample.name}: status is 200 or 201`]: (r) => r.status === 200 || r.status === 201,
                [`${sample.name}: response time < 5s`]: (r) => r.timings.duration < 5000,
                [`${sample.name}: has response body`]: (r) => r.body && r.body.length > 0
            });

            if (success) {
                console.log(`  ✓ Successfully uploaded ${sample.name} (${response.timings.duration.toFixed(0)}ms)`);
            } else {
                console.error(`  ✗ Failed to upload ${sample.name}. Status: ${response.status}`);
                if (response.body) {
                    const body = parseJSON(response);
                    if (body) {
                        console.error(`  Response: ${JSON.stringify(body).substring(0, 150)}`);
                    }
                }
            }
        });

        // Wait between tests
        if (index < samples.length - 1) {
            sleep(2);
        }
    });
}

export function teardown(data) {
    console.log('');
    console.log('===========================================');
    console.log('Smoke Test Completed');
    console.log('===========================================');
}
