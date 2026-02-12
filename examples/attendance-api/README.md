# Attendance Bulk Upload API - Example Implementation

This folder contains a complete working example of using the API Load Test Framework to test a real-world bulk upload API endpoint.

## Overview

This example demonstrates load testing for an **Attendance Bulk Upload API** from LankemERP system. It shows how to:

- Test APIs with JSON payload data of varying sizes (10, 50, and 100 records)
- Authenticate with JWT tokens
- Handle dynamic data transformation (updating dates)
- Implement custom helper functions for domain-specific logic
- Create smoke, load, and stress test scenarios

## Structure

```
attendance-api/
├── README.md                           # This file
├── tests/
│   ├── attendance-bulk-upload-smoke.js    # Quick validation test
│   ├── attendance-bulk-upload-load.js     # Performance baseline test
│   └── attendance-bulk-upload-stress.js   # Peak capacity test
├── utils/
│   └── attendance-helpers.js           # Domain-specific helper functions
└── sample-data/
    ├── attendance-sample-10.json       # Small dataset (10 records)
    ├── attendance-sample-50.json       # Medium dataset (50 records)
    ├── attendance-sample-100.json      # Large dataset (100 records)
    └── README.md                       # Sample data documentation
```

## API Endpoint Tested

**Endpoint:** `/api/CheckrollAttendanceBulkUpload/SavePluckingCheckrollAttendanceBulkUpload`

**Method:** POST

**Authentication:** JWT Bearer Token

**Payload:** JSON array of attendance records with fields:
- `workerNumber`
- `collectedDate` (dynamically updated to current date)
- `collectedAmount`
- Other domain-specific fields

## How This Example Was Created

1. **Started with generic test template** from `templates/smoke.template.js`
2. **Configured environment** in `config/env.js` to point to API endpoint
3. **Created domain helpers** in `utils/attendance-helpers.js` for data transformation
4. **Added performance thresholds** in tests based on expected response times
5. **Prepared test data** in multiple sizes to test different load scenarios

## Running These Tests

### Prerequisites

```bash
# 1. Update config/env.js with your API credentials
# 2. Ensure API server is running (default: http://localhost:5000)
```

### Run Smoke Test

```bash
k6 run -e ENVIRONMENT=dev examples/attendance-api/tests/attendance-bulk-upload-smoke.js
```

### Run Load Test

```bash
k6 run -e ENVIRONMENT=dev examples/attendance-api/tests/attendance-bulk-upload-load.js
```

### Run Stress Test

```bash
k6 run -e ENVIRONMENT=dev examples/attendance-api/tests/attendance-bulk-upload-stress.js
```

## Performance Results

Based on real-world testing:

| Dataset Size | Response Time | Status |
|--------------|---------------|--------|
| 10 records   | ~1.23s       | ✓ PASS |
| 50 records   | ~5.63s       | ⚠️ WARNING |
| 100 records  | ~11.66s      | ❌ FAIL |

**See [RESULTS_ANALYSIS.md](../../RESULTS_ANALYSIS.md) for detailed performance analysis and optimization recommendations.**

## Adapting This Example for Your API

To adapt this example for your own bulk upload API:

1. **Copy the test structure:**
   ```bash
   cp -r examples/attendance-api examples/my-api
   ```

2. **Update sample data:**
   - Replace JSON files with your API's payload structure
   - Maintain multiple file sizes for different test scenarios

3. **Modify helper functions:**
   - Update `utils/my-api-helpers.js` with your data transformation logic
   - Keep the same function signatures for consistency

4. **Adjust thresholds:**
   - Update performance expectations based on your API's requirements
   - Consider payload size, processing complexity, and business needs

5. **Update test scenarios:**
   - Modify VU count and duration based on expected traffic
   - Add custom validation logic for your API's responses

## Key Learnings from This Example

1. **Authentication patterns:** JWT tokens can be in different response paths
2. **Dynamic data:** Real-world APIs often need date/timestamp updates
3. **Performance thresholds:** Different payload sizes need different expectations
4. **Validation:** Check both HTTP status and business logic responses
5. **Data preparation:** Having multiple dataset sizes helps identify scaling issues

## Related Documentation

- [RESULTS_ANALYSIS.md](../../RESULTS_ANALYSIS.md) - Performance analysis of this example
- [GETTING_STARTED.md](../../GETTING_STARTED.md) - Framework setup guide
- [README.md](../../README.md) - Main framework documentation

---

**This is a reference implementation showing real-world usage. Your API tests will follow the same patterns but with your specific endpoints, data, and business logic.**
