/**
 * AgriGen ERP - Attendance Business Rules Validation Test
 * 
 * This script validates that generated attendance data follows all business rules.
 * Run this to verify data integrity before load testing.
 * 
 * Run: k6 run tests/validation/business-rules-validation.js --vus 1 --iterations 1
 */

import { check } from 'k6';
import { generateTestScenarios, generateRealisticAttendance } from '../../utils/attendance-helpers.js';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    console.log('\n=== AgriGen ERP Attendance Business Rules Validation ===\n');

    // Test predefined scenarios
    console.log('📋 Testing Predefined Scenarios...\n');
    const scenarios = generateTestScenarios();

    scenarios.forEach((record, index) => {
        console.log(`\n--- Scenario ${index + 1}: ${record.employeeName} ---`);
        console.log(`JobTypeID: ${record.jobTypeID}, DayType: ${record.dayType}, IsHoliday: ${record.isHoliday}`);
        console.log(`Amount: ${record.amount}, NormValue: ${record.normValue}`);
        console.log(`OverKilo: ${record.overKilo}, ManDays: ${record.manDays}`);

        // Validate business rules
        const checks = validateBusinessRules(record);

        if (checks.allValid) {
            console.log('✅ All business rules passed');
        } else {
            console.log('❌ Business rules validation failed');
            checks.failures.forEach(failure => console.log(`  - ${failure}`));
        }
    });

    // Test random realistic data
    console.log('\n\n📊 Testing Random Realistic Attendance Data (100 records)...\n');
    const randomRecords = generateRealisticAttendance(100);

    let totalValid = 0;
    let totalInvalid = 0;
    const failures = [];

    randomRecords.forEach((record, index) => {
        const checks = validateBusinessRules(record);
        if (checks.allValid) {
            totalValid++;
        } else {
            totalInvalid++;
            failures.push({
                recordIndex: index + 1,
                employeeName: record.employeeName,
                failures: checks.failures
            });
        }
    });

    console.log(`\n✅ Valid Records: ${totalValid}/100`);
    console.log(`❌ Invalid Records: ${totalInvalid}/100`);

    if (totalInvalid > 0) {
        console.log('\n⚠️  Invalid Records Details:');
        failures.forEach(failure => {
            console.log(`\nRecord #${failure.recordIndex}: ${failure.employeeName}`);
            failure.failures.forEach(f => console.log(`  - ${f}`));
        });
    }

    // Final validation check
    const validationPass = check({ totalInvalid }, {
        'All records pass business rules': (r) => r.totalInvalid === 0,
        'At least 95% records valid': (r) => totalValid >= 95,
    });

    console.log('\n\n=== Validation Summary ===');
    console.log(validationPass ? '✅ PASSED: All business rules validated successfully!' : '❌ FAILED: Some business rules violations detected');
    console.log('=========================\n');

    // Display job type distribution
    console.log('\n📊 Job Type Distribution:');
    const jobTypeCounts = {};
    randomRecords.forEach(r => {
        jobTypeCounts[r.jobTypeID] = (jobTypeCounts[r.jobTypeID] || 0) + 1;
    });
    Object.keys(jobTypeCounts).sort().forEach(jobType => {
        const percentage = (jobTypeCounts[jobType] / randomRecords.length * 100).toFixed(1);
        console.log(`  JobType ${jobType}: ${jobTypeCounts[jobType]} records (${percentage}%)`);
    });

    // Display day type distribution
    console.log('\n📊 Day Type Distribution:');
    const dayTypeCounts = {};
    randomRecords.forEach(r => {
        dayTypeCounts[r.dayType] = (dayTypeCounts[r.dayType] || 0) + 1;
    });
    Object.keys(dayTypeCounts).sort().forEach(dayType => {
        const percentage = (dayTypeCounts[dayType] / randomRecords.length * 100).toFixed(1);
        console.log(`  DayType ${dayType}: ${dayTypeCounts[dayType]} records (${percentage}%)`);
    });

    // Display holiday distribution
    const holidayCount = randomRecords.filter(r => r.isHoliday).length;
    console.log(`\n📊 Holiday Distribution:`);
    console.log(`  Holiday: ${holidayCount} (${(holidayCount / randomRecords.length * 100).toFixed(1)}%)`);
    console.log(`  Non-Holiday: ${randomRecords.length - holidayCount} (${((randomRecords.length - holidayCount) / randomRecords.length * 100).toFixed(1)}%)`);
}

/**
 * Validate business rules for a single attendance record
 */
function validateBusinessRules(record) {
    const failures = [];

    // Rule 1: OverKilo calculation
    if ([5, 7].includes(record.jobTypeID)) {
        if (record.overKilo !== 0) {
            failures.push(`Rule 1: JobType ${record.jobTypeID} should have OverKilo=0, got ${record.overKilo}`);
        }
    } else {
        const expectedOverKilo = record.amount > record.normValue ? record.amount - record.normValue : 0;
        if (record.overKilo !== expectedOverKilo) {
            failures.push(`Rule 1: Expected OverKilo=${expectedOverKilo}, got ${record.overKilo}`);
        }
    }

    // Rule 2: ManDays calculation for JobType 3,6
    if ([3, 6].includes(record.jobTypeID)) {
        let expectedManDays = 0;

        if (record.dayType === 1 && record.amount >= record.normValue) {
            expectedManDays = record.isHoliday ? 1.5 : 1;
        } else if (record.dayType === 2 && record.amount >= record.normValue / 2) {
            expectedManDays = record.isHoliday ? 0.75 : 0.5;
        }

        if (record.manDays !== expectedManDays && expectedManDays !== 0) {
            failures.push(`Rule 2: Expected ManDays=${expectedManDays}, got ${record.manDays}`);
        }
    }

    // Rule 3: JobType 8 restrictions
    if (record.jobTypeID === 8) {
        if (record.isHoliday) {
            failures.push('Rule 3: JobType 8 cannot be IsHoliday=true');
        }
        if (record.manDays === 1.5 || record.manDays === 0.75) {
            failures.push(`Rule 3: JobType 8 cannot have ManDays=${record.manDays}`);
        }
    }

    // Rule 4: JobType [3,6,8] cannot be DayType 3
    if ([3, 6, 8].includes(record.jobTypeID)) {
        if (record.dayType === 3) {
            failures.push(`Rule 4: JobType ${record.jobTypeID} cannot have DayType=3`);
        }
    }

    // Rule 5: JobType [5,7,8] must be DayType 3
    if ([5, 7, 8].includes(record.jobTypeID)) {
        if (record.dayType !== 3) {
            failures.push(`Rule 5: JobType ${record.jobTypeID} must have DayType=3, got ${record.dayType}`);
        }
    }

    // Rule 6: No OT
    if (record.dayOT !== 0 || record.nightOT !== 0) {
        failures.push(`Rule 6: No OT allowed (dayOT=${record.dayOT}, nightOT=${record.nightOT})`);
    }

    return {
        allValid: failures.length === 0,
        failures: failures
    };
}
