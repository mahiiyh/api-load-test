import { randomInt, randomString } from '../../../utils/helpers.js';

/**
 * Attendance Bulk Upload Data Generators for AgriGen ERP
 * 
 * Business Rules:
 * 1. OverKilo: If Amount > NormValue, OverKilo = Amount - NormValue
 *    - JobTypeID [5,7] = No OverKilo
 * 
 * 2. ManDays for JobTypeID [3,6]:
 *    - Amount >= NormValue, DayType=1, IsHoliday=True  → ManDays=1.5
 *    - Amount >= NormValue, DayType=1, IsHoliday=False → ManDays=1
 *    - Amount >= NormValue/2, DayType=2, IsHoliday=True  → ManDays=0.75
 *    - Amount >= NormValue/2, DayType=2, IsHoliday=False → ManDays=0.5
 * 
 * 3. JobTypeID=8: Cannot be IsHoliday=True, ManDays cannot be 1.5 or 0.75
 * 4. JobTypeID [3,6,8]: Cannot be DayType=3
 * 5. JobTypeID [5,7,8]: Must be DayType=3
 * 6. No OT (dayOT=0, nightOT=0)
 */

// Master data from AgriGen system
const MASTER_DATA = {
    groupID: 1112,
    estateID: 4224,
    normValue: 20,
    minNormValue: 18,
    noam: 20,
    divisionIDs: [13, 17],
    fieldIDs: [156, 157, 158, 159, 160, 161, 162, 163, 164, 165],
    jobTypeIDs: [3, 5, 6, 7, 8],
    employeeTypeID: 3,
    genderIDs: [1, 2]
};

/**
 * Calculate OverKilo based on business rules
 */
function calculateOverKilo(amount, normValue, jobTypeID) {
    // JobTypeID 5,7 do not consider norm value and have no OverKilo
    if ([5, 7].includes(jobTypeID)) {
        return 0;
    }

    // If amount > normValue, calculate overKilo
    if (amount > normValue) {
        return amount - normValue;
    }

    return 0;
}

/**
 * Calculate ManDays based on business rules
 */
function calculateManDays(amount, normValue, jobTypeID, dayType, isHoliday) {
    // For JobTypeID 3,6 - norm-based calculation
    if ([3, 6].includes(jobTypeID)) {
        if (dayType === 1) {
            // Full day
            if (amount >= normValue) {
                return isHoliday ? 1.5 : 1;
            }
            return 0; // Didn't meet norm
        } else if (dayType === 2) {
            // Half day
            if (amount >= normValue / 2) {
                return isHoliday ? 0.75 : 0.5;
            }
            return 0; // Didn't meet half norm
        }
    }

    // For JobTypeID 5,7 - fixed mandays
    if ([5, 7].includes(jobTypeID)) {
        return 1;
    }

    // For JobTypeID 8 - cannot be holiday, so always 1
    if (jobTypeID === 8) {
        return 1;
    }

    return 1; // Default
}

/**
 * Validate and get appropriate DayType for JobType
 */
function getValidDayType(jobTypeID) {
    // JobTypeID [5,7,8] must be DayType 3
    if ([5, 7, 8].includes(jobTypeID)) {
        return 3;
    }

    // JobTypeID [3,6] can be DayType 1 or 2 (not 3)
    if ([3, 6].includes(jobTypeID)) {
        return randomInt(1, 2);
    }

    return 1; // Default
}

/**
 * Validate IsHoliday for JobType
 */
function getValidIsHoliday(jobTypeID, dayType) {
    // JobTypeID 8 cannot be holiday
    if (jobTypeID === 8) {
        return false;
    }

    // JobTypeID [5,7] with DayType 3 - usually not holiday-based
    if ([5, 7].includes(jobTypeID) && dayType === 3) {
        return false;
    }

    // 20% chance of holiday for other cases
    return Math.random() < 0.2;
}

/**
 * Generate a realistic attendance record following all business rules
 */
export function generateAttendanceRecord(overrides = {}) {
    const empNumber = overrides.employeeNumber || randomInt(1000, 9999).toString();
    const employeeID = overrides.employeeID || randomInt(10000, 15000);

    // Select random master data
    const jobTypeID = overrides.jobTypeID || MASTER_DATA.jobTypeIDs[randomInt(0, MASTER_DATA.jobTypeIDs.length - 1)];
    const divisionID = overrides.divisionID || MASTER_DATA.divisionIDs[randomInt(0, MASTER_DATA.divisionIDs.length - 1)];
    const fieldID = overrides.fieldID || MASTER_DATA.fieldIDs[randomInt(0, MASTER_DATA.fieldIDs.length - 1)];
    const genderID = overrides.genderID || MASTER_DATA.genderIDs[randomInt(0, MASTER_DATA.genderIDs.length - 1)];

    // Get valid DayType based on JobType
    const dayType = overrides.dayType !== undefined ? overrides.dayType : getValidDayType(jobTypeID);

    // Get valid IsHoliday based on JobType and DayType
    const isHoliday = overrides.isHoliday !== undefined ? overrides.isHoliday : getValidIsHoliday(jobTypeID, dayType);

    // Generate amount based on JobType
    let amount;
    if ([3, 6].includes(jobTypeID)) {
        // Plucking jobs - vary around norm value
        if (dayType === 1) {
            // Full day - typically meet or exceed norm
            amount = randomInt(18, 28);
        } else if (dayType === 2) {
            // Half day - around half of norm
            amount = randomInt(10, 15);
        } else {
            amount = randomInt(15, 25);
        }
    } else if ([5, 7].includes(jobTypeID)) {
        // Non-plucking jobs - no norm consideration
        amount = randomInt(0, 5);
    } else if (jobTypeID === 8) {
        // Other work - dayType 3
        amount = randomInt(0, 10);
    } else {
        amount = randomInt(15, 25);
    }

    // Override amount if provided
    if (overrides.amount !== undefined) {
        amount = overrides.amount;
    }

    const normValue = MASTER_DATA.normValue;
    const minNormValue = MASTER_DATA.minNormValue;

    // Calculate OverKilo based on rules
    const overKilo = calculateOverKilo(amount, normValue, jobTypeID);

    // Calculate ManDays based on rules
    const manDays = calculateManDays(amount, normValue, jobTypeID, dayType, isHoliday);

    const record = {
        employeeAttendanceID: 0,
        groupID: MASTER_DATA.groupID,
        amount: amount,
        collectedDate: overrides.collectedDate || new Date().toISOString(),
        divisionID: divisionID,
        employeeNumber: empNumber,
        employeeTypeID: MASTER_DATA.employeeTypeID,
        estateID: MASTER_DATA.estateID,
        fieldID: fieldID,
        gangID: overrides.gangID || 0,
        jobTypeID: jobTypeID,
        sessionID: overrides.sessionID || 0,
        workTypeID: overrides.workTypeID || 0,
        dayType: dayType,
        dayOT: 0,  // No OT as per requirement
        nightOT: 0, // No OT as per requirement
        noam: MASTER_DATA.noam,
        createdBy: overrides.createdBy || 1,
        isActive: overrides.isActive !== undefined ? overrides.isActive : true,
        isHoliday: isHoliday,
        musterChitID: overrides.musterChitID || 1,
        mainDivisionID: divisionID,
        overKilo: overKilo,
        operatorID: overrides.operatorID || 0,
        manDays: manDays,
        employeeID: employeeID,
        registrationNumber: empNumber,
        employeeName: overrides.employeeName || `Employee_${empNumber}`,
        genderID: genderID,
        normValue: normValue,
        minNormValue: minNormValue,
        errorMessage: "string"
    };

    return record;
}

/**
 * Generate bulk attendance data array with realistic distribution
 */
export function generateBulkAttendanceData(count = 10, baseData = {}) {
    const records = [];
    for (let i = 0; i < count; i++) {
        records.push(generateAttendanceRecord(baseData));
    }
    return records;
}

/**
 * Generate realistic attendance pattern with job type distribution
 * Job Type Distribution:
 * - 50% JobType 3 (Tea Plucking)
 * - 20% JobType 6 (Other Plucking)
 * - 15% JobType 5 (Sundry)
 * - 10% JobType 7 (Tapping)
 * - 5%  JobType 8 (Other)
 */
export function generateRealisticAttendance(employeeCount = 50, date = null) {
    const attendanceDate = date || new Date().toISOString();
    const records = [];

    for (let i = 0; i < employeeCount; i++) {
        const empNumber = (1000 + i).toString();
        const employeeID = 10000 + i;

        // Distribute job types realistically
        let jobTypeID;
        const rand = Math.random();
        if (rand < 0.5) {
            jobTypeID = 3; // 50% - Tea Plucking
        } else if (rand < 0.7) {
            jobTypeID = 6; // 20% - Other Plucking
        } else if (rand < 0.85) {
            jobTypeID = 5; // 15% - Sundry
        } else if (rand < 0.95) {
            jobTypeID = 7; // 10% - Tapping
        } else {
            jobTypeID = 8; // 5% - Other
        }

        records.push(generateAttendanceRecord({
            employeeNumber: empNumber,
            registrationNumber: empNumber,
            employeeID: employeeID,
            employeeName: `Employee_${empNumber}`,
            collectedDate: attendanceDate,
            jobTypeID: jobTypeID
        }));
    }

    return records;
}

/**
 * Generate attendance with specific scenarios for testing
 */
export function generateTestScenarios() {
    const scenarios = [];

    // Scenario 1: JobType 3, Full day, Holiday, Meets norm
    scenarios.push(generateAttendanceRecord({
        jobTypeID: 3,
        dayType: 1,
        isHoliday: true,
        amount: 22,
        employeeNumber: "1001",
        employeeID: 10001,
        employeeName: "Test_FullDay_Holiday_MeetsNorm"
        // Expected: manDays=1.5, overKilo=2
    }));

    // Scenario 2: JobType 3, Full day, No Holiday, Meets norm
    scenarios.push(generateAttendanceRecord({
        jobTypeID: 3,
        dayType: 1,
        isHoliday: false,
        amount: 21,
        employeeNumber: "1002",
        employeeID: 10002,
        employeeName: "Test_FullDay_NoHoliday_MeetsNorm"
        // Expected: manDays=1, overKilo=1
    }));

    // Scenario 3: JobType 6, Half day, Holiday, Meets half norm
    scenarios.push(generateAttendanceRecord({
        jobTypeID: 6,
        dayType: 2,
        isHoliday: true,
        amount: 12,
        employeeNumber: "1003",
        employeeID: 10003,
        employeeName: "Test_HalfDay_Holiday_MeetsHalfNorm"
        // Expected: manDays=0.75, overKilo=0
    }));

    // Scenario 4: JobType 6, Half day, No Holiday, Meets half norm
    scenarios.push(generateAttendanceRecord({
        jobTypeID: 6,
        dayType: 2,
        isHoliday: false,
        amount: 11,
        employeeNumber: "1004",
        employeeID: 10004,
        employeeName: "Test_HalfDay_NoHoliday_MeetsHalfNorm"
        // Expected: manDays=0.5, overKilo=0
    }));

    // Scenario 5: JobType 5, DayType 3, No overKilo
    scenarios.push(generateAttendanceRecord({
        jobTypeID: 5,
        dayType: 3,
        isHoliday: false,
        amount: 2,
        employeeNumber: "1005",
        employeeID: 10005,
        employeeName: "Test_Sundry_NoOverKilo"
        // Expected: manDays=1, overKilo=0
    }));

    // Scenario 6: JobType 7, DayType 3, No overKilo
    scenarios.push(generateAttendanceRecord({
        jobTypeID: 7,
        dayType: 3,
        isHoliday: false,
        amount: 3,
        employeeNumber: "1006",
        employeeID: 10006,
        employeeName: "Test_Tapping_NoOverKilo"
        // Expected: manDays=1, overKilo=0
    }));

    // Scenario 7: JobType 8, DayType 3, No Holiday
    scenarios.push(generateAttendanceRecord({
        jobTypeID: 8,
        dayType: 3,
        isHoliday: false,
        amount: 5,
        employeeNumber: "1007",
        employeeID: 10007,
        employeeName: "Test_Other_NoHoliday"
        // Expected: manDays=1, overKilo=0
    }));

    return scenarios;
}

/**
 * Sample employee data for testing
 */
export const sampleEmployees = [
    {
        employeeID: 11993,
        employeeNumber: "774",
        employeeName: "S.Abinesh",
        registrationNumber: "774",
        genderID: 1
    },
    // Add more employees here as needed
];

export default {
    generateAttendanceRecord,
    generateBulkAttendanceData,
    generateRealisticAttendance,
    generateTestScenarios,
    sampleEmployees,
    MASTER_DATA
};
