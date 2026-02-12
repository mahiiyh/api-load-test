# 🚀 Getting Started with API Load Test

A step-by-step guide to get you up and running in 5 minutes.

## 📋 What You'll Need

- **5 minutes** of your time
- **k6** installed ([install guide](https://k6.io/docs/get-started/installation/))
- **Your API endpoint** URL
- **Authentication credentials** (if your API requires auth)

---

## 🎯 Choose Your Path

This framework supports **any REST API**. Choose how you want to get started:

### Path A: Start with Templates (Recommended for New Projects)
- **Time**: 15 minutes
- **Best for**: Creating tests for your specific API
- **You'll get**: Clean templates to customize for your endpoints
- **Start at**: [Step 1](#-step-1-install-k6)

### Path B: Learn from Working Example (Recommended for Learning)
- **Time**: 10 minutes
- **Best for**: Understanding how the framework works
- **You'll get**: Complete working example with real performance analysis
- **Jump to**: [Working Example Guide](#-working-example-attendance-api)

### Path C: Use Generic Tests (Quick Test)
- **Time**: 5 minutes
- **Best for**: Testing basic CRUD endpoints quickly
- **You'll get**: Ready-to-run generic test suite
- **Jump to**: [Step 3](#%EF%B8%8F-step-3-configure-for-your-api)

---

## 🎯 Step 1: Install k6

Choose your operating system:

### macOS
```bash
brew install k6
```

### Windows
```powershell
# Using Chocolatey
choco install k6

# Or using Winget
winget install k6
```

### Linux
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Verify Installation
```bash
k6 version
# Should output: k6 v0.x.x
```

---

## 📦 Step 2: Get the Project

```bash
# Clone the repository
git clone https://github.com/mahiiyh/api-load-test.git

# Navigate to the directory
cd api-load-test
```

---

## ⚙️ Step 3: Configure for Your API

### Option A: Quick Setup (Recommended)

Edit `config/env.js` and update these values:

```javascript
export const environments = {
  dev: {
    baseURL: 'http://localhost:5000',  // ← Your API URL here
    testUsers: {
      admin: {
        username: 'your-username',     // ← Your username
        password: 'your-password'      // ← Your password
      }
    }
  }
};
```

### Option B: Multiple Environments

Configure dev, staging, and production:

```javascript
export const environments = {
  dev: {
    baseURL: 'http://localhost:5000',
    testUsers: { admin: { username: 'admin', password: 'dev123' } }
  },
  staging: {
    baseURL: 'https://staging-api.example.com',
    testUsers: { admin: { username: 'admin', password: 'staging123' } }
  },
  production: {
    baseURL: 'https://api.example.com',
    testUsers: { admin: { username: 'admin', password: 'prod123' } }
  }
};
```

---

## 🧪 Step 4: Run Your First Test

### Quick Smoke Test (1 minute)

This will verify your API is working:

```bash
k6 run -e ENVIRONMENT=dev tests/smoke/api-smoke.js
```

**Expected Output:**
```
✓ login successful
✓ token received
...
checks........................: 100.00% ✓ 10 ✗ 0
http_req_duration.............: avg=500ms p(95)=800ms
```

### What Just Happened?

1. ✅ k6 logged in to your API
2. ✅ Tested a few key endpoints
3. ✅ Verified response times
4. ✅ Checked for errors

---

## 📊 Step 5: Understand the Results

### Green (✓) = Good!
```
✓ http_req_duration: p(95)=800ms
```
This means 95% of requests completed in under 800ms. Great!

### Red (✗) = Needs Attention
```
✗ http_req_duration: p(95)=5000ms (threshold: <2000ms)
```
This means responses are too slow. Time to optimize!

---

## 🎓 Step 6: Try Different Test Types

### Load Test (Normal Traffic)
```bash
k6 run -e ENVIRONMENT=dev tests/load/api-load.js
```
Simulates 2-10 users over 5-10 minutes.

### Stress Test (Find Limits)
```bash
k6 run -e ENVIRONMENT=dev tests/stress/api-stress.js
```
Gradually increases load to find breaking points.

### Spike Test (Traffic Burst)
```bash
k6 run -e ENVIRONMENT=dev tests/spike/api-spike.js
```
Sudden spike from 1 to 100 users.

---

## 🔧 Customizing Tests for Your API

### Example: Testing Your Endpoints

Edit `tests/smoke/api-smoke.js`:

```javascript
export default function() {
  const token = adminToken;  // Already authenticated!
  
  // Test YOUR endpoints
  group('Your API Tests', () => {
    
    // Get all users
    let res = http.get(`${BASE_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    check(res, {
      'users loaded': (r) => r.status === 200,
      'has users': (r) => JSON.parse(r.body).length > 0
    });
    
    // Create a user
    res = http.post(`${BASE_URL}/api/users`, JSON.stringify({
      name: 'Test User',
      email: 'test@example.com'
    }), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    check(res, {
      'user created': (r) => r.status === 201
    });
    
  });
}
```

---

## � Using Templates to Create Custom Tests

The framework provides clean templates that you can copy and customize for your specific API.

### Available Templates

| Template | Purpose | Complexity |
|----------|---------|------------|
| `smoke.template.js` | Quick validation | ⭐ Easy |
| `load.template.js` | Performance baseline | ⭐⭐ Medium |
| `stress.template.js` | Find breaking points | ⭐⭐⭐ Advanced |

### Creating Your First Custom Test

#### 1. Copy a Template

```bash
# Copy smoke test template
cp templates/smoke.template.js tests/smoke/products-api-smoke.js
```

#### 2. Open and Find `← UPDATE:` Markers

The template has clear markers showing what to customize:

```javascript
// BEFORE (template):
const response = http.get(
    `${baseUrl}/api/resources`,  // ← UPDATE: Your list endpoint
    { headers }
);

// AFTER (your customization):
const response = http.get(
    `${baseUrl}/api/products`,   // Updated to your endpoint
    { headers }
);
```

#### 3. Update All Sections

Search for all `← UPDATE:` comments and replace with:
- Your actual API endpoints
- Your request payloads
- Your validation logic

#### 4. Run Your Custom Test

```bash
k6 run -e ENVIRONMENT=dev tests/smoke/products-api-smoke.js
```

### Template Customization Guide

Each template includes:
- ✅ **Inline documentation** explaining each section
- ✅ **Clear markers** (`← UPDATE:`) for customization points
- ✅ **Example code** showing common patterns
- ✅ **Best practices** for load testing

**See [templates/README.md](templates/README.md) for comprehensive customization guide.**

---

## 📚 Working Example: Attendance API

Learn by exploring a complete, production-tested example included in the repository.

### What's in the Example

The `examples/attendance-api/` folder contains:
- ✅ **Full test suite** - Smoke, Load, and Stress tests
- ✅ **Real test data** - JSON files with 10, 50, 100 records
- ✅ **Custom helpers** - Data transformation logic
- ✅ **Performance analysis** - Real results with 8 optimization recommendations
- ✅ **Documentation** - How it was built and lessons learned

### Explore the Example

#### 1. Navigate to Example

```bash
cd examples/attendance-api/
```

#### 2. Read the Documentation

```bash
# Open the example README
cat README.md
```

#### 3. Examine Test Structure

```bash
# View the smoke test
cat tests/attendance-bulk-upload-smoke.js
```

Key things to notice:
- How authentication is handled
- How sample data files are loaded with `open()`
- How data is transformed dynamically (dates updated)
- How different payload sizes are tested
- How thresholds differ by data volume

#### 4. Run the Example Tests

```bash
# From project root
k6 run -e ENVIRONMENT=dev examples/attendance-api/tests/attendance-bulk-upload-smoke.js
```

#### 5. Review Performance Analysis

Open `RESULTS_ANALYSIS.md` to see:
- Real performance metrics from actual tests
- Problem identification (100 records = 11.66s)
- 8 specific optimization recommendations
- Before/after improvement targets

### Adapting the Example for Your API

**Step 1: Copy the structure**
```bash
cp -r examples/attendance-api examples/my-api
cd examples/my-api
```

**Step 2: Replace sample data**
- Update JSON files with your API's payload structure
- Keep multiple file sizes for different test scenarios

**Step 3: Update helpers**
```bash
# Edit utils/attendance-helpers.js (rename to your domain)
# Replace data transformation logic with your needs
```

**Step 4: Modify tests**
- Update endpoint URLs
- Adjust payload structure
- Change validation logic
- Tweak performance thresholds

**Step 5: Run your adapted tests**
```bash
k6 run -e ENVIRONMENT=dev examples/my-api/tests/my-api-smoke.js
```

**See [examples/attendance-api/README.md](examples/attendance-api/README.md) for detailed walkthrough.**

---

## �📈 Next Steps

### 1. Customize Performance Thresholds

Edit `config/thresholds.js`:

```javascript
export const thresholds = {
  http_req_duration: ['p(95)<2000'],   // 95% under 2 seconds
  http_req_failed: ['rate<0.05'],      // Less than 5% failures
  
  // Add your own thresholds
  'http_req_duration{endpoint:users}': ['p(95)<1000'],
};
```

### 2. Add Your Endpoints

Create custom tests in `tests/` directory.

### 3. Run Regularly

Add to your CI/CD pipeline:

```yaml
# .github/workflows/load-test.yml
name: Load Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run k6 test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/smoke/api-smoke.js
          flags: -e ENVIRONMENT=staging
```

---

## 🆘 Troubleshooting

### "k6: command not found"
→ k6 is not installed. Go back to Step 1.

### "Failed to authenticate"
→ Check your credentials in `config/env.js`

### "Connection refused"
→ Is your API running? Check the baseURL in `config/env.js`

### "Thresholds failed"
→ Your API might be slow. Check the [Results Analysis](RESULTS_ANALYSIS.md) guide.

---

## 💡 Tips for Success

1. **Start Small**: Run smoke tests first
2. **Test Locally**: Test against localhost before staging/production
3. **Monitor Resources**: Watch CPU/Memory during tests
4. **Read Results**: The output tells you what to optimize
5. **Iterate**: Make changes, test again, improve

---

## 📚 More Resources

- **Full Documentation**: [README.md](README.md)
- **Performance Analysis**: [RESULTS_ANALYSIS.md](RESULTS_ANALYSIS.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **k6 Official Docs**: https://k6.io/docs/

---

## 🎉 You're Ready!

You now know how to:
- ✅ Install and configure k6
- ✅ Run load tests against your API
- ✅ Understand test results
- ✅ Customize tests for your needs

**Go ahead and run some tests!** 🚀

---

**Questions?** Open an issue or check the [k6 community forum](https://community.k6.io/).
