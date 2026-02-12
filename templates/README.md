# Test Templates

This folder contains clean, generic templates you can copy and adapt for your own API load testing needs.

## Available Templates

| Template | Purpose | When to Use |
|----------|---------|-------------|
| [smoke.template.js](smoke.template.js) | Quick validation | Daily checks, pre-deployment verification |
| [load.template.js](load.template.js) | Performance baseline | Capacity planning, performance benchmarking |
| [stress.template.js](stress.template.js) | Breaking point testing | Finding limits, disaster recovery planning |

## How to Use These Templates

### Quick Start

1. **Choose the right template** for your testing needs
2. **Copy to your test directory:**
   ```bash
   cp templates/smoke.template.js tests/smoke/my-api-smoke.js
   ```

3. **Update configuration** in `config/env.js`:
   ```javascript
   export const config = {
       dev: {
           baseUrl: 'https://your-api.com',  // Your API URL
           endpoints: {
               auth: { login: '/api/auth/login' },
               // Add your endpoints
           }
       }
   };
   ```

4. **Find and replace** all sections marked with `← UPDATE:` in the template

5. **Run your test:**
   ```bash
   k6 run -e ENVIRONMENT=dev tests/smoke/my-api-smoke.js
   ```

### Detailed Customization Guide

#### 1. Update Test Options

```javascript
export const options = {
    vus: 10,              // Adjust: Number of virtual users
    duration: '5m',       // Adjust: Test duration
    thresholds: {
        http_req_duration: ['p(95)<2000'],  // Adjust: Your SLA requirements
    }
};
```

#### 2. Replace Endpoints

Search for `← UPDATE:` comments in templates:

```javascript
// BEFORE (template):
const response = http.get(
    `${baseUrl}/api/resources`,  // ← UPDATE: Your list endpoint
    { headers }
);

// AFTER (your API):
const response = http.get(
    `${baseUrl}/api/v1/products`,
    { headers }
);
```

#### 3. Customize Payloads

```javascript
// BEFORE (template):
const payload = {
    name: 'Test Resource',
    description: 'Created by smoke test'
};

// AFTER (your API):
const payload = {
    productName: 'Widget',
    sku: 'WDG-001',
    price: 29.99,
    stock: 100
};
```

#### 4. Add Custom Validation

```javascript
// Template provides basic checks:
checkResponse(response, 200, 'endpoint works');

// Add your business logic validation:
const body = parseJSON(response);
check(body, {
    'has product array': (b) => Array.isArray(b.products),
    'products have prices': (b) => b.products.every(p => p.price > 0),
    'stock levels valid': (b) => b.products.every(p => p.stock >= 0)
});
```

#### 5. Adjust Load Patterns

**Smoke Test (Quick Validation):**
```javascript
export const options = {
    vus: 1,
    duration: '30s'
};
```

**Load Test (Realistic Traffic):**
```javascript
export const options = {
    stages: [
        { duration: '2m', target: 10 },   // Ramp up
        { duration: '5m', target: 10 },   // Sustain
        { duration: '2m', target: 0 }     // Ramp down
    ]
};
```

**Stress Test (Find Limits):**
```javascript
export const options = {
    stages: [
        { duration: '2m', target: 50 },
        { duration: '3m', target: 100 },
        { duration: '2m', target: 200 },  // Push to limits
        { duration: '5m', target: 0 }     // Recovery
    ]
};
```

## Template Structure Explained

### All templates include:

1. **Header Documentation** - Purpose, usage instructions, customization points
2. **Imports** - Required k6 modules and utility functions
3. **Options** - Test configuration (VUs, duration, thresholds)
4. **setup()** - Runs once before test (authentication, data prep)
5. **default()** - Main test function (runs for each VU iteration)
6. **teardown()** - Runs once after test (cleanup, summary)
7. **Inline Comments** - Guidance marked with `← UPDATE:`

### Key Concepts

**Virtual Users (VUs):** Simulate concurrent users hitting your API
**Stages:** Define load patterns (ramp up, sustain, ramp down)
**Thresholds:** Pass/fail criteria for performance metrics
**Groups:** Organize related requests for better reporting
**Checks:** Validate responses and business logic

## Example: Creating Your First Test

Let's create a smoke test for a products API:

```bash
# 1. Copy template
cp templates/smoke.template.js tests/smoke/products-smoke.js

# 2. Edit the file and update:
#    - Endpoint URLs to /api/products
#    - Payload structure for product data
#    - Validation logic for product responses

# 3. Run the test
k6 run -e ENVIRONMENT=dev tests/smoke/products-smoke.js
```

## Common Patterns

### Pattern 1: CRUD Operations

```javascript
group('CRUD Operations', () => {
    // Create
    const createResp = http.post(`${baseUrl}/api/items`, payload, { headers });
    const itemId = parseJSON(createResp).id;
    
    // Read
    http.get(`${baseUrl}/api/items/${itemId}`, { headers });
    
    // Update
    http.put(`${baseUrl}/api/items/${itemId}`, updatePayload, { headers });
    
    // Delete
    http.del(`${baseUrl}/api/items/${itemId}`, { headers });
});
```

### Pattern 2: Search/Filter

```javascript
group('Search Operations', () => {
    // Simple search
    http.get(`${baseUrl}/api/items?q=test`, { headers });
    
    // Advanced filters
    http.get(`${baseUrl}/api/items?category=electronics&maxPrice=1000`, { headers });
    
    // Pagination
    http.get(`${baseUrl}/api/items?page=1&limit=20`, { headers });
});
```

### Pattern 3: Bulk Operations

```javascript
group('Bulk Upload', () => {
    const bulkData = JSON.parse(open('./data/bulk-items.json'));
    
    const response = http.post(
        `${baseUrl}/api/items/bulk`,
        JSON.stringify(bulkData),
        { headers }
    );
    
    checkResponse(response, 202, 'bulk upload accepted');
});
```

## Next Steps

1. **Check the working example**: See `examples/attendance-api/` for a complete implementation
2. **Read the documentation**: Review [GETTING_STARTED.md](../GETTING_STARTED.md) for detailed setup
3. **Start simple**: Begin with a smoke test, then expand to load and stress tests
4. **Iterate**: Run tests, analyze results, optimize, repeat

## Need Help?

- **Working Example**: `examples/attendance-api/` - Real-world implementation
- **Documentation**: `GETTING_STARTED.md` - Comprehensive setup guide
- **Framework Docs**: `README.md` - Full feature documentation
- **Configuration**: `config/env.js` - Environment setup examples

---

**Remember:** These templates are starting points. Adapt them to your specific API structure, business logic, and performance requirements.
