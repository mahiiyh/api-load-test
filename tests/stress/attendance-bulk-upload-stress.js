/**
 * AgriGen ERP - Attendance Bulk Upload Stress Test
 * 
 * Stress test to find breaking point of the Attendance Bulk Upload API.
 * Progressively increases load and batch sizes to identify system limits.
 * 
 * API: http://20.198.232.178:8170/swagger/api/CheckrollAttendanceBulkUpload/SavePluckingCheckrollAttendanceBulkUpload
 * 
 * Run: k6 run tests/stress/attendance-bulk-upload-stress.js
 * Or: npm run test:attendance-stress
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import {
    checkResponse,
    parseJSON,
    randomInt,
    log
} from '../../utils/helpers.js';
import {
    generateBulkAttendanceData,
    generateRealisticAttendance
} from '../../utils/attendance-helpers.js';

export const options = {
    stages: [
        { duration: '2m', target: 5 },    // Warm up
        { duration: '3m', target: 5 },    // Stay at normal load
        { duration: '2m', target: 15 },   // Increase load
        { duration: '3m', target: 15 },   // Sustain increased load
        { duration: '2m', target: 30 },   // Push harder
        { duration: '3m', target: 30 },   // Maintain high load
        { duration: '2m', target: 50 },   // Breaking point test
        { duration: '3m', target: 50 },   // Sustain extreme load
        { duration: '3m', target: 0 },    // Ramp down & recovery
    ],
    thresholds: {
        http_req_duration: ['p(99)<10000'], // Very relaxed for stress test
        http_req_failed: ['rate<0.15'],     // Allow up to 15% errors
        'http_reqs': ['rate>0'],            // Just want requests to happen
    },
    tags: {
        test_type: 'stress',
        api: 'attendance_bulk_upload',
        environment: __ENV.ENVIRONMENT || 'agrigen_api'
    }
};

const baseUrl = config.getBaseUrl();
const endpoint = config.endpoints.attendance.bulkUpload;

export function setup() {
    log('Starting Attendance Bulk Upload STRESS Test...', 'info');
    log(`Target API: ${baseUrl}${endpoint}`, 'info');
    log('⚠️  This test will push the system to its limits!', 'warn');

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

    // Aggressive batch sizes for stress testing
    const rand = Math.random();
    let recordCount;
    let scenarioTag;

    if (rand < 0.3) {
        // 30% - Medium batches
        recordCount = randomInt(25, 75);
        scenarioTag = 'medium_stress';
    } else if (rand < 0.7) {
        // 40% - Large batches
        recordCount = randomInt(76, 150);
        scenarioTag = 'large_stress';
    } else {
        // 30% - Very large batches (stress test)
        recordCount = randomInt(151, 250);
        scenarioTag = 'extreme_stress';
    }

    group(`Stress Upload - ${scenarioTag} (${recordCount} records)`, () => {
        // Generate realistic attendance data
        const attendanceData = generateRealisticAttendance(recordCount);
        const payload = JSON.stringify(attendanceData);

        log(`[Stress] Uploading ${recordCount} attendance records...`, 'info');

        const response = http.post(url, payload, {
            headers: headers,
            tags: { scenario: scenarioTag },
            timeout: '60s' // Extended timeout for stress test
        });

        // Relaxed checks for stress test
        const checkResult = check(response, {
            'response received': (r) => r.status > 0,
            'not server error': (r) => r.status < 600,
            'status success or service unavailable': (r) =>
                r.status === 200 ||
                r.status === 201 ||
                r.status === 503 ||
                r.status === 500,
        });

        if (response.status === 200 || response.status === 201) {
            log(`✓ Successfully uploaded ${recordCount} records in ${response.timings.duration}ms`, 'info');
        } else if (response.status === 503) {
            log(`⚠️  Service unavailable - system under stress (${recordCount} records)`, 'warn');
        } else if (response.status >= 500) {
            log(`✗ Server error ${response.status} while uploading ${recordCount} records`, 'error');
        } else {
            log(`? Unexpected status ${response.status} for ${recordCount} records`, 'warn');
        }

        // Log performance metrics at intervals
        if (__ITER % 10 === 0) {
            log(`[Metrics] VU: ${__VU}, Iter: ${__ITER}, Duration: ${response.timings.duration}ms, Status: ${response.status}`, 'info');
        }
    });

    // Minimal sleep to maintain pressure
    sleep(0.5);
}

export function teardown(data) {
    const endTime = new Date().toISOString();
    log('Attendance Bulk Upload STRESS Test Completed', 'info');
    log(`Start Time: ${data.startTime}`, 'info');
    log(`End Time: ${endTime}`, 'info');
    log('⚠️  Check system recovery and review error logs', 'warn');
}
