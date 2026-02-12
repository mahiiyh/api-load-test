# Sample Test Data

This directory contains sample JSON datasets for testing bulk upload APIs.

## 📂 Files

| File | Records | Size | Use Case |
|------|---------|------|----------|
| `attendance-sample-10.json` | 10 | ~2 KB | Quick smoke tests |
| `attendance-sample-50.json` | 50 | ~10 KB | Standard load tests |
| `attendance-sample-100.json` | 100 | ~20 KB | Stress tests |

## 🎯 Usage

### In k6 Tests

```javascript
import { open } from 'k6';

// Load sample data
const sample10 = JSON.parse(open('./sample-data/attendance-sample-10.json'));
const sample50 = JSON.parse(open('./sample-data/attendance-sample-50.json'));
const sample100 = JSON.parse(open('./sample-data/attendance-sample-100.json'));

export default function() {
  // Use in HTTP requests
  const response = http.post(
    `${BASE_URL}/api/bulk-upload`,
    JSON.stringify(sample50),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
```

### Dynamic Date Updates

Update timestamps before using:

```javascript
const data = JSON.parse(open('./sample-data/attendance-sample-10.json'));

// Update to current date
data.forEach(record => {
  record.collectedDate = new Date().toISOString();
});
```

## 🔧 Generating Custom Data

Use the generation script to create custom datasets:

```bash
node scripts/generate-sample-data.js
```

## 📋 Data Structure

Each JSON file contains an array of records:

```json
[
  {
    "employeeAttendanceID": 0,
    "groupID": 1112,
    "amount": 23,
    "collectedDate": "2026-02-13T10:00:00.000Z",
    "divisionalCode": "TL",
    "estateCode": "SHLE"
    // ... more fields
  }
  // ... more records
]
```

## 🎨 Customization

To create your own test data:

1. **Copy existing file**: `cp attendance-sample-10.json my-data.json`
2. **Modify structure**: Edit to match your API schema
3. **Update test scripts**: Reference new file in tests
4. **Adjust size**: Add/remove records as needed

## 📊 Performance Guidelines

| Record Count | Expected Response Time | Recommended For |
|--------------|----------------------|-----------------|
| 1-10 | < 1 second | Smoke tests |
| 50 | < 3 seconds | Load tests |
| 100+ | < 5 seconds | Stress tests |

## 🚀 Example Tests

See these tests for usage examples:

- `tests/smoke/attendance-sample-smoke.js`
- `tests/load/attendance-sample-load.js`
- `tests/stress/attendance-bulk-upload-stress.js`
