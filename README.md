# 🚀 API Load Test

A professional, production-ready **k6 load testing framework** for testing any REST API. Built with best practices, comprehensive test scenarios, and clear performance metrics.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![k6](https://img.shields.io/badge/k6-latest-7d64ff)](https://k6.io/)
[![GitHub stars](https://img.shields.io/github/stars/mahiiyh/api-load-test.svg)](https://github.com/mahiiyh/api-load-test/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/mahiiyh/api-load-test.svg)](https://github.com/mahiiyh/api-load-test/issues)

## 🌐 Web Interface

**Test any API with a beautiful web interface** at [loadtest.mahiiyh.me](https://loadtest.mahiiyh.me) (coming soon)

The web app provides:
- 🎨 User-friendly interface for configuring API tests
- 📊 Real-time visualization of test results
- 📈 Interactive charts and performance metrics
- 🚀 No installation required - test any API from your browser

See [web/](web/) for local development or [WEB_DEPLOYMENT.md](WEB_DEPLOYMENT.md) for deployment instructions.

## ✨ Features

- **🎯 Multiple Test Scenarios**: Smoke, Load, Stress, Spike, and Soak tests
- **🔐 Authentication Support**: JWT token-based authentication
- **📊 Detailed Metrics**: Request duration, failure rates, and custom thresholds
- **🔧 Easy Configuration**: Environment-based config for dev/staging/production
- **📦 Sample Data**: Ready-to-use sample datasets (10, 50, 100 records)
- **📈 Performance Reports**: Built-in threshold validation and suggestions
- **🎨 Clean Code**: Modular structure with reusable utilities

## 🎯 Framework vs Examples

This repository contains **TWO key components**:

### 1. **Generic Framework** (Reusable for Any API)
The core framework is **fully generic** and can test any REST API:
- `config/` - Environment and threshold configuration
- `utils/` - Authentication, validation, and helper functions
- `templates/` - Clean templates to copy and customize
- `tests/` - Generic test structure for all scenarios

### 2. **Working Example** (Attendance Bulk Upload API)
A complete real-world implementation showing the framework in action:
- `examples/attendance-api/` - Full implementation testing an attendance API
- Demonstrates authentication, data transformation, and bulk operations
- Includes real performance analysis and optimization recommendations

**You can use this framework for ANY API by:**
1. Copying templates from `templates/`
2. Updating `config/env.js` with your API details
3. Customizing test files for your endpoints
4. Running tests just like the attendance example

**See the [Templates Guide](templates/README.md) and [Getting Started](GETTING_STARTED.md) for step-by-step instructions.**

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

### Option 1: Use Generic Tests (5 minutes)

1. **Configure your API** - Edit `config/env.js`:
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

2. **Run a generic test:**
   ```bash
   k6 run -e ENVIRONMENT=dev tests/smoke/api-smoke.js
   ```

### Option 2: Create Custom Tests from Templates (15 minutes)

1. **Copy a template:**
   ```bash
   cp templates/smoke.template.js tests/smoke/my-api-smoke.js
   ```

2. **Update the template** with your endpoints:
   - Find all `← UPDATE:` comments
   - Replace with your API URLs and payloads

3. **Run your custom test:**
   ```bash
   k6 run -e ENVIRONMENT=dev tests/smoke/my-api-smoke.js
   ```

**See [templates/README.md](templates/README.md) for detailed customization guide.**

### Option 3: Learn from Working Example (30 minutes)

Explore the complete attendance API example:

```bash
# Study the example structure
cd examples/attendance-api/

# Run the example tests
k6 run -e ENVIRONMENT=dev tests/attendance-bulk-upload-smoke.js
```

**See [examples/attendance-api/README.md](examples/attendance-api/README.md) for walkthrough.**

---

### After Running Tests

You'll see comprehensive results:
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
├── 📂 config/                    # ⚙️  FRAMEWORK: Configuration
│   ├── env.js                    #    Environment configs (dev/staging/prod)
│   └── thresholds.js             #    Performance thresholds
│
├── 📂 utils/                     # 🔧 FRAMEWORK: Utilities
│   ├── auth.js                   #    Authentication helpers
│   └── helpers.js                #    Common utilities
│
├── 📂 templates/                 # 📋 FRAMEWORK: Test Templates
│   ├── README.md                 #    How to use templates
│   ├── smoke.template.js         #    Smoke test template
│   ├── load.template.js          #    Load test template
│   └── stress.template.js        #    Stress test template
│
├── 📂 tests/                     # 🧪 FRAMEWORK: Generic Tests
│   ├── smoke/                    #    Quick validation tests
│   │   ├── api-smoke.js          #    Generic API smoke test
│   │   └── lankem-erp-smoke.js   #    Custom API smoke test
│   ├── load/                     #    Standard load tests
│   │   ├── api-load.js           #    Generic load test
│   │   └── lankem-erp-load.js    #    Custom load test
│   ├── stress/                   #    Stress/capacity tests
│   │   └── api-stress.js         #    Generic stress test
│   ├── spike/                    #    Spike tests
│   │   └── api-spike.js          #    Generic spike test
│   ├── soak/                     #    Long-duration tests
│   │   └── api-soak.js           #    Generic soak test
│   └── validation/               #    Business logic validation
│       └── business-rules-validation.js
│
├── 📂 examples/                  # 📚 EXAMPLES: Working Implementations
│   └── attendance-api/           #    Complete attendance API example
│       ├── README.md             #    Example documentation
│       ├── tests/                #    Example test files
│       │   ├── attendance-bulk-upload-smoke.js
│       │   ├── attendance-bulk-upload-load.js
│       │   └── attendance-bulk-upload-stress.js
│       ├── utils/                #    Example helpers
│       │   └── attendance-helpers.js
│       └── sample-data/          #    Example test data
│           ├── attendance-sample-10.json
│           ├── attendance-sample-50.json
│           ├── attendance-sample-100.json
│           └── README.md
│
├── 📂 scripts/                   # 🛠️  TOOLS: Utilities
│   └── generate-sample-data.js   #    Data generation helper
│
├── 📂 reports/                   # 📊 OUTPUT: Test results (gitignored)
│
├── 📄 .gitignore
├── 📄 .env.example               #    Environment template
├── 📄 package.json               #    NPM scripts and metadata
├── 📄 LICENSE                    #    MIT License
├── 📄 README.md                  #    This file
├── 📄 GETTING_STARTED.md         #    Quick start guide
├── 📄 RESULTS_ANALYSIS.md        #    Performance analysis (example)
├── 📄 CONTRIBUTING.md            #    Contribution guidelines
├── 📄 CHANGELOG.md               #    Version history
└── 📄 CONTRIBUTORS.md            #    Team recognition
```

**Legend:**
- **⚙️ FRAMEWORK**: Core reusable components for any API
- **📋 TEMPLATES**: Copy these to create your own tests
- **📚 EXAMPLES**: Real-world reference implementations
- **🛠️ TOOLS**: Helper scripts and utilities

## 🎯 Working Example: Attendance Bulk Upload API

The repository includes a **complete, production-tested example** demonstrating the framework with a real bulk upload API:

### What's Included

- **Full test suite**: Smoke, Load, and Stress tests
- **Real test data**: JSON files with 10, 50, and 100 records
- **Custom helpers**: Domain-specific data transformation
- **Performance analysis**: Real results with optimization recommendations

### Location

```
examples/attendance-api/
├── README.md                           # Example overview
├── tests/                              # Test implementations
├── utils/attendance-helpers.js         # Custom helpers
└── sample-data/                        # Test datasets
```

### Key Learnings from This Example

1. **Authentication patterns** - JWT tokens in non-standard response paths
2. **Dynamic data** - Updating timestamps before upload
3. **Performance issues** - 100 records taking 11.66s (documented with fixes)
4. **Multiple payload sizes** - Testing with different data volumes
5. **Real optimization** - 8 specific recommendations in [RESULTS_ANALYSIS.md](RESULTS_ANALYSIS.md)

### How to Run the Example

```bash
# Quick smoke test (validates all payload sizes)
k6 run -e ENVIRONMENT=dev examples/attendance-api/tests/attendance-bulk-upload-smoke.js

# Full load test (performance baseline)
k6 run -e ENVIRONMENT=dev examples/attendance-api/tests/attendance-bulk-upload-load.js

# Stress test (find breaking point)
k6 run -e ENVIRONMENT=dev examples/attendance-api/tests/attendance-bulk-upload-stress.js
```

### Adapting for Your API

1. **Copy the structure**: `cp -r examples/attendance-api examples/my-api`
2. **Update sample data**: Replace JSON files with your payload structure
3. **Modify helpers**: Update transformation logic for your data
4. **Adjust thresholds**: Set performance expectations for your API
5. **Run tests**: Same commands, different endpoints

**See [examples/attendance-api/README.md](examples/attendance-api/README.md) for detailed walkthrough.**

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
