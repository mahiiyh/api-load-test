# 🚀 API Load Test

A professional, production-ready **k6 load testing framework** for testing any REST API. Built with best practices, comprehensive test scenarios, and clear performance metrics.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![k6](https://img.shields.io/badge/k6-latest-7d64ff)](https://k6.io/)
[![GitHub stars](https://img.shields.io/github/stars/mahiiyh/api-load-test.svg)](https://github.com/mahiiyh/api-load-test/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/mahiiyh/api-load-test.svg)](https://github.com/mahiiyh/api-load-test/issues)

## ✨ Features

- **🎯 Multiple Test Scenarios**: Smoke, Load, Stress, Spike, and Soak tests
- **🔐 Authentication Support**: JWT token-based authentication
- **📊 Detailed Metrics**: Request duration, failure rates, and custom thresholds
- **🔧 Easy Configuration**: Environment-based config for dev/staging/production
- **📦 Sample Data**: Ready-to-use sample datasets (10, 50, 100 records)
- **📈 Performance Reports**: Built-in threshold validation and suggestions
- **🎨 Clean Code**: Modular structure with reusable utilities

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Scenarios](#test-scenarios)
- [Understanding Results](#understanding-results)
- [Performance Optimization](#performance-optimization)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Prerequisites

- **[k6](https://k6.io/docs/get-started/installation/)** - Load testing tool
- **Node.js** (v16+) - For running scripts (optional)

### Install k6

```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Docker
docker pull grafana/k6
```

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mahiiyh/api-load-test.git
cd api-load-test

# (Optional) Install npm dependencies for scripts
npm install
```

## 🚀 Quick Start

### 1. Configure Your API

Edit `config/env.js` to set your API endpoints and credentials:

```javascript
export const environments = {
  dev: {
    baseURL: 'http://localhost:5000',  // Your API URL
    testUsers: {
      admin: {
        username: 'admin',
        password: 'yourpassword'
      }
    }
  }
};
```

### 2. Run Your First Test

```bash
# Quick smoke test (validates API is working)
k6 run -e ENVIRONMENT=dev tests/smoke/api-smoke.js

# Or use npm scripts
npm run test:smoke
```

### 3. View Results

After the test completes, you'll see:
- ✅ **Pass/Fail Metrics** - Which thresholds passed
- 📊 **Performance Stats** - Response times, throughput
- 🎯 **Recommendations** - What to optimize

## ⚙️ Configuration

### Environment Setup

Configure different environments in `config/env.js`:

```javascript
export const environments = {
  dev: {
    baseURL: 'http://localhost:5000',
    testUsers: { /* ... */ }
  },
  staging: {
    baseURL: 'https://staging-api.example.com',
    testUsers: { /* ... */ }
  },
  production: {
    baseURL: 'https://api.example.com',
    testUsers: { /* ... */ }
  }
};
```

### Performance Thresholds

Customize thresholds in `config/thresholds.js`:

```javascript
export const thresholds = {
  http_req_duration: ['p(95)<2000'],  // 95% of requests under 2s
  http_req_failed: ['rate<0.05'],     // Less than 5% failures
  // Add custom thresholds...
};
```

## 🧪 Running Tests

### Command Line

```bash
# Specify environment with -e flag
k6 run -e ENVIRONMENT=dev tests/smoke/api-smoke.js
k6 run -e ENVIRONMENT=staging tests/load/api-load.js
```

### NPM Scripts

```bash
npm run test:smoke          # Quick smoke test
npm run test:load           # Standard load test
npm run test:stress         # Stress test (find limits)
npm run test:spike          # Spike test (sudden traffic)
npm run test:soak           # Soak test (long duration)
```

### Bulk Upload Tests (Example Use Case)

Test bulk upload endpoints with different payload sizes:

```bash
# Test with sample data (10, 50, 100 records)
npm run test:attendance-smoke
npm run test:attendance-load
npm run test:attendance-stress
```

## 📊 Test Scenarios

### 1. **Smoke Test** 🔥
**Purpose**: Quick validation that API is functional  
**Duration**: ~1 minute  
**VUs**: 1  
**Use Case**: Pre-deployment checks, CI/CD pipelines

```bash
k6 run -e ENVIRONMENT=dev tests/smoke/api-smoke.js
```

### 2. **Load Test** 📈
**Purpose**: Test under expected normal load  
**Duration**: 5-10 minutes  
**VUs**: 2-10 (ramping)  
**Use Case**: Validate performance under typical usage

```bash
k6 run -e ENVIRONMENT=dev tests/load/api-load.js
```

### 3. **Stress Test** 💪
**Purpose**: Find breaking points  
**Duration**: 10-20 minutes  
**VUs**: 5-50 (gradual increase)  
**Use Case**: Capacity planning, failure mode analysis

```bash
k6 run -e ENVIRONMENT=dev tests/stress/api-stress.js
```

### 4. **Spike Test** ⚡
**Purpose**: Handle sudden traffic bursts  
**Duration**: 5 minutes  
**VUs**: 1 → 100 → 1 (sudden spike)  
**Use Case**: Marketing campaigns, viral traffic

```bash
k6 run -e ENVIRONMENT=dev tests/spike/api-spike.js
```

### 5. **Soak Test** ⏳
**Purpose**: Long-term stability (memory leaks, degradation)  
**Duration**: 1-4 hours  
**VUs**: 5-10 (constant)  
**Use Case**: Production stability validation

```bash
k6 run -e ENVIRONMENT=dev tests/soak/api-soak.js
```

## 📈 Understanding Results

### Example Output

```
✓ http_req_duration......: avg=1.2s  p(95)=1.8s  p(99)=2.1s
✓ http_req_failed........: 0.00%    (0 out of 1000)
✓ http_reqs..............: 1000     16.67/s
✓ iterations.............: 500      8.33/s
```

### Key Metrics Explained

| Metric | What It Means | Good Target |
|--------|---------------|-------------|
| **http_req_duration** | How long requests take | p95 < 2s |
| **http_req_failed** | % of failed requests | < 1% |
| **http_reqs** | Total requests made | - |
| **iterations** | Test iterations completed | - |
| **vus** | Virtual users (concurrent) | - |

### Threshold Results

- ✅ **Green (Passed)**: Performance is acceptable
- ❌ **Red (Failed)**: Performance issue detected

## 🔍 Performance Optimization

### Common Issues & Solutions

#### ❌ Problem: High Response Times (p95 > 5s)

**Symptoms:**
```
✗ http_req_duration: p(95)=11.66s (threshold: p(95)<5000)
```

**Root Causes:**
1. **Database queries** - Unoptimized queries, missing indexes
2. **Bulk operations** - Processing too many records at once
3. **External API calls** - Third-party services slowing down
4. **Memory/CPU limits** - Server resources exhausted

**Solutions:**
- Add database indexes on frequently queried fields
- Implement batch processing with queues
- Add caching (Redis, Memcached)
- Optimize queries (use EXPLAIN, avoid N+1)
- Scale horizontally (add more servers)
- Use async processing for heavy tasks

#### ❌ Problem: Request Failures (> 1%)

**Symptoms:**
```
✗ http_req_failed: rate=5.2% (threshold: rate<0.01)
```

**Root Causes:**
1. **Server errors (500s)** - Application crashes
2. **Timeouts** - Requests taking too long
3. **Rate limiting** - Too many requests blocked
4. **Authentication issues** - Token expiration

**Solutions:**
- Check server logs for error details
- Add error handling and retries
- Implement rate limiting on client side
- Refresh tokens before expiration
- Add health checks and monitoring

#### ❌ Problem: Inconsistent Performance

**Symptoms:**
```
Response times vary wildly: avg=2s, max=45s
```

**Root Causes:**
1. **Resource contention** - Other processes competing
2. **Garbage collection** - Long GC pauses
3. **Cold starts** - Serverless/container spin-up
4. **Network issues** - Unstable connection

**Solutions:**
- Use dedicated test environment
- Tune JVM/runtime GC settings
- Pre-warm serverless functions
- Test from consistent network location

### Performance Benchmarks

| Record Size | Target p95 | Target p99 | Acceptable Failure Rate |
|-------------|------------|------------|------------------------|
| 1-10 records | < 1s | < 2s | < 0.1% |
| 50 records | < 3s | < 5s | < 0.5% |
| 100 records | < 5s | < 10s | < 1% |

## 📁 Project Structure

```
api-load-test/
├── config/
│   ├── env.js                    # Environment configurations
│   └── thresholds.js             # Performance thresholds
├── tests/
│   ├── smoke/                    # Quick validation tests
│   │   ├── api-smoke.js
│   │   ├── lankem-erp-smoke.js
│   │   └── attendance-sample-smoke.js
│   ├── load/                     # Standard load tests
│   │   ├── api-load.js
│   │   ├── lankem-erp-load.js
│   │   └── attendance-sample-load.js
│   ├── stress/                   # Stress/capacity tests
│   │   ├── api-stress.js
│   │   └── attendance-bulk-upload-stress.js
│   ├── spike/                    # Spike tests
│   │   └── api-spike.js
│   ├── soak/                     # Long-duration tests
│   │   └── api-soak.js
│   └── validation/               # Business logic validation
│       └── business-rules-validation.js
├── utils/
│   ├── auth.js                   # Authentication helpers
│   ├── helpers.js                # Common utilities
│   └── attendance-helpers.js     # Domain-specific helpers
├── sample-data/                  # Test datasets
│   ├── attendance-sample-10.json
│   ├── attendance-sample-50.json
│   └── attendance-sample-100.json
├── scripts/
│   └── generate-sample-data.js   # Data generation scripts
├── reports/                      # Test results (gitignored)
├── .gitignore
├── .env.example                  # Environment template
├── package.json
├── LICENSE
└── README.md
```

## 🎯 Example Use Case: Bulk Upload API

This repository includes a complete example for testing bulk upload endpoints. Check out:

- **Tests**: `tests/load/attendance-sample-load.js`
- **Sample Data**: `sample-data/attendance-sample-*.json`
- **Results Analysis**: See "Performance Optimization" section

Run the example:

```bash
# Test bulk upload with different payload sizes
npm run test:attendance-smoke

# Full load test
npm run test:attendance-load
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [k6](https://k6.io/) by Grafana Labs
- Inspired by load testing best practices from the k6 community

## 📞 Support

- 📖 [k6 Documentation](https://k6.io/docs/)
- 💬 [k6 Community Forum](https://community.k6.io/)
- 🐛 [Report Issues](https://github.com/mahiiyh/api-load-test/issues)

---

## 👥 Contributors

- **[@mahiiyh](https://github.com/mahiiyh)** - Mahima Sandaken (Creator & Maintainer)
- **[@Vishwa0527](https://github.com/Vishwa0527)** - Contributor
- **[@kavishkadinajara](https://github.com/kavishkadinajara)** - Contributor

**Made with ❤️ for performance-focused developers**
