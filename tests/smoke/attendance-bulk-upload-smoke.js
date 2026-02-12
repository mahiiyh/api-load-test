/**
 * AgriGen ERP - Attendance Bulk Upload Smoke Test
 * 
 * Quick validation test for the Attendance Bulk Upload API.
 * Verifies basic functionality with minimal load.
 * 
 * API: http://20.198.232.178:8170/swagger/api/CheckrollAttendanceBulkUpload/SavePluckingCheckrollAttendanceBulkUpload
 * 
 * Run: k6 run tests/smoke/attendance-bulk-upload-smoke.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { log, parseJSON } from '../../utils/helpers.js';
import { generateRealisticAttendance } from '../../utils/attendance-helpers.js';

export const options = {
    vus: 1,
    duration: '1m',
    thresholds: {
        http_req_duration: ['p(95)<3000'],
        http_req_failed: ['rate<0.01'],
    },
    tags: {
        test_type: 'smoke',
        api: 'attendance_bulk_upload'
    }
};

const baseUrl = config.getBaseUrl();
const endpoint = config.endpoints.attendance.bulkUpload;

export function setup() {
    log('Starting Attendance Bulk Upload Smoke Test...', 'info');
    log(`Target API: ${baseUrl}${endpoint}`, 'info');
    return { baseUrl, endpoint };
}

export default function (data) {
    const url = `${data.baseUrl}${data.endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    group('Single Record Upload', () => {
        const attendanceData = generateRealisticAttendance(1);
        const payload = JSON.stringify(attendanceData);

        const response = http.post(url, payload, { headers });

        check(response, {
            'single record: status OK': (r) => r.status === 200 || r.status === 201,
            'single record: has body': (r) => r.body && r.body.length > 0,
            'single record: response time < 2s': (r) => r.timings.duration < 2000,
        });

        log(`Single record upload: ${response.status}, ${response.timings.duration}ms`, 'info');
    });

    sleep(2);

    group('Small Batch Upload (10 records)', () => {
        const attendanceData = generateRealisticAttendance(10);
        const payload = JSON.stringify(attendanceData);

        const response = http.post(url, payload, { headers });

        check(response, {
            'small batch: status OK': (r) => r.status === 200 || r.status === 201,
            'small batch: has body': (r) => r.body && r.body.length > 0,
            'small batch: response time < 3s': (r) => r.timings.duration < 3000,
        });

        log(`Small batch upload: ${response.status}, ${response.timings.duration}ms`, 'info');
    });

    sleep(2);

    group('Medium Batch Upload (50 records)', () => {
        const attendanceData = generateRealisticAttendance(50);
        const payload = JSON.stringify(attendanceData);

        const response = http.post(url, payload, { headers });

        check(response, {
            'medium batch: status OK': (r) => r.status === 200 || r.status === 201,
            'medium batch: has body': (r) => r.body && r.body.length > 0,
            'medium batch: response time < 5s': (r) => r.timings.duration < 5000,
        });

        log(`Medium batch upload: ${response.status}, ${response.timings.duration}ms`, 'info');
    });

    sleep(3);
}

export function teardown(data) {
    log('Attendance Bulk Upload Smoke Test Completed', 'info');
}
