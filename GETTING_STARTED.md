# 🚀 Getting Started with API Load Test

A step-by-step guide to get you up and running in 5 minutes.

## 📋 What You'll Need

- **5 minutes** of your time
- **k6** installed ([install guide](https://k6.io/docs/get-started/installation/))
- **Your API endpoint** URL
- **Authentication credentials** (if your API requires auth)

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

## 📈 Next Steps

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
