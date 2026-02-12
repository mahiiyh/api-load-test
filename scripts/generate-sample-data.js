/**
 * Dataset Generator for AgriGen ERP Attendance
 * 
 * This script generates sample attendance JSON datasets following all business rules.
 * Run: k6 run scripts/generate-sample-data.js --vus 1 --iterations 1
 */

import { generateRealisticAttendance, generateTestScenarios } from '../utils/attendance-helpers.js';
import { SharedArray } from 'k6/data';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    console.log('\n=== Generating Sample Attendance Datasets ===\n');

    // Generate 50 records dataset
    const data50 = generateRealisticAttendance(50, '2026-02-13T00:15:00.000Z');
    console.log('✅ Generated 50 realistic attendance records');
    console.log('Sample (first record):');
    console.log(JSON.stringify(data50[0], null, 2));

    // Generate 100 records dataset
    const data100 = generateRealisticAttendance(100, '2026-02-13T00:15:00.000Z');
    console.log('\n✅ Generated 100 realistic attendance records');

    // Display job type distribution for 100 records
    const jobTypeCounts = {};
    data100.forEach(r => {
        jobTypeCounts[r.jobTypeID] = (jobTypeCounts[r.jobTypeID] || 0) + 1;
    });

    console.log('\n📊 Job Type Distribution (100 records):');
    Object.keys(jobTypeCounts).sort().forEach(jobType => {
        const percentage = (jobTypeCounts[jobType] / data100.length * 100).toFixed(1);
        const jobNames = {
            '3': 'Tea Plucking',
            '5': 'Sundry',
            '6': 'Other Plucking',
            '7': 'Tapping',
            '8': 'Other'
        };
        console.log(`  JobType ${jobType} (${jobNames[jobType]}): ${jobTypeCounts[jobType]} records (${percentage}%)`);
    });

    // Calculate total ManDays
    const totalManDays = data100.reduce((sum, r) => sum + r.manDays, 0);
    console.log(`\n📊 Total ManDays (100 records): ${totalManDays.toFixed(2)}`);

    // Calculate holiday count
    const holidayCount = data100.filter(r => r.isHoliday).length;
    console.log(`📊 Holiday Records: ${holidayCount} (${(holidayCount / data100.length * 100).toFixed(1)}%)`);

    console.log('\n💾 To save these datasets to files:');
    console.log('   Copy the JSON output above and save to:');
    console.log('   - sample-data/attendance-sample-50.json');
    console.log('   - sample-data/attendance-sample-100.json');

    console.log('\n✅ Dataset generation complete!');
    console.log('\nNOTE: K6 cannot write files directly. To save the datasets:');
    console.log('1. Run: k6 run scripts/generate-sample-data.js > output.txt');
    console.log('2. Extract JSON from output.txt');
    console.log('3. Or use the pre-generated files in sample-data/');

    // Return formatted JSON (will be in console output)
    console.log('\n=== 50 RECORDS JSON (Copy below) ===');
    console.log(JSON.stringify(data50, null, 2));

    console.log('\n=== 100 RECORDS JSON (Copy below) ===');
    console.log(JSON.stringify(data100, null, 2));
}
