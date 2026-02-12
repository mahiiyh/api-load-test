# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-13

### 🔄 Major Restructuring - Generic Framework

**BREAKING CHANGES**: Repository restructured to clearly separate generic framework from specific examples.

This major update transforms the repository into a **truly generic API load testing framework** that can be used for ANY REST API, while keeping the attendance API as a working reference example.

### Added

#### Templates System
- **`templates/`** - Clean, copy-ready test templates
  - `smoke.template.js` - Quick validation test template
  - `load.template.js` - Performance baseline test template
  - `stress.template.js` - Breaking point test template
  - `templates/README.md` - Comprehensive template customization guide
- Clear `← UPDATE:` markers throughout templates
- Inline documentation with best practices
- Common patterns (CRUD, search, bulk operations)

#### Examples Directory
- **`examples/attendance-api/`** - Complete working example
  - Full test suite (smoke, load, stress)
  - Real test data (10/50/100 record JSON files)
  - Custom helpers for domain-specific logic
  - Complete documentation with lessons learned
  - Real performance analysis with 8 optimization recommendations

### Changed

#### Repository Structure
- **Framework components** now clearly separated:
  - `config/` - Generic configuration (any API)
  - `utils/` - Generic utilities (any API)
  - `templates/` - Templates to copy (any API)
  - `tests/` - Generic test structure (any API)
- **Example components** moved to `examples/`:
  - `examples/attendance-api/tests/` - Attendance-specific tests
  - `examples/attendance-api/utils/` - Domain helpers
  - `examples/attendance-api/sample-data/` - Test datasets
- Old `sample-data/` → `examples/attendance-api/sample-data/`
- Attendance-specific tests relocated from `tests/` to `examples/attendance-api/tests/`

#### Documentation Updates
- **README.md**: Added "Framework vs Examples" section explaining generic nature
- **README.md**: Updated project structure with visual indicators (⚙️ FRAMEWORK vs 📚 EXAMPLES)
- **README.md**: New Quick Start with 3 clear paths (Generic/Templates/Example)
- **GETTING_STARTED.md**: Added "Choose Your Path" guide
- **GETTING_STARTED.md**: New sections on using templates and learning from examples
- **package.json**: Updated description emphasizing "ANY REST API" support
- **package.json**: Added keywords: "generic-framework", "templates", "any-api"

#### NPM Scripts
- Renamed scripts for clarity:
  - `test:attendance-*` → `example:attendance-*`
- Added help command to list available scripts
- Updated all paths to reflect new structure

### Documentation

- `templates/README.md` - Complete guide to template system
- `examples/attendance-api/README.md` - Deep dive into working example
- Enhanced main README with framework architecture explanation
- Updated GETTING_STARTED with three usage paths

### Migration Guide for v1.x Users

If you were using v1.0.0, here's what changed:

**File Locations:**
```bash
# Old location → New location
tests/smoke/attendance-bulk-upload-smoke.js → examples/attendance-api/tests/attendance-bulk-upload-smoke.js
tests/load/attendance-bulk-upload-load.js → examples/attendance-api/tests/attendance-bulk-upload-load.js
utils/attendance-helpers.js → examples/attendance-api/utils/attendance-helpers.js
sample-data/ → examples/attendance-api/sample-data/
```

**NPM Scripts:**
```bash
# Old command → New command
npm run test:attendance-smoke → npm run example:attendance-smoke
npm run test:attendance-load → npm run example:attendance-load
npm run test:attendance-stress → npm run example:attendance-stress
```

**Using the Framework:**
- Generic tests in `tests/` still work as before
- To create custom tests, now copy from `templates/`
- See `templates/README.md` for customization guide

---

## [1.0.0] - 2026-02-13

### 🎉 Initial Release

Professional k6 load testing framework for REST APIs.

### Added

#### Core Framework
- Complete k6 load testing suite with 5 test scenarios
- Smoke, Load, Stress, Spike, and Soak test implementations
- Modular test structure with reusable utilities
- Environment-based configuration system (dev/staging/production)
- Customizable performance thresholds

#### Authentication
- JWT token-based authentication support
- Automatic token refresh handling
- Multi-user role support (admin, manager, user)
- Flexible authentication utilities

#### Test Scenarios
- **Smoke Tests**: Quick validation (1 VU, 1 minute)
- **Load Tests**: Normal load simulation (2-10 VUs, 5-10 minutes)
- **Stress Tests**: Breaking point discovery (5-50 VUs, 10-20 minutes)
- **Spike Tests**: Sudden traffic bursts (1→100→1 VUs, 5 minutes)
- **Soak Tests**: Long-term stability (5-10 VUs, 1-4 hours)

#### Sample Data & Examples
- Bulk upload API test examples
- Sample datasets (10, 50, 100 records)
- Business rules validation tests
- Dynamic data generation scripts

#### Documentation
- Comprehensive README with quick start guide
- Contributing guidelines
- Results analysis with optimization recommendations
- Sample data usage guide
- MIT License

#### Utilities
- HTTP request helpers
- Response validation utilities
- Error handling and logging
- Performance metric collection
- Custom check functions

#### Configuration
- Environment configuration (base URLs, credentials)
- Performance thresholds configuration
- Test scenario parameters
- NPM scripts for easy execution

### Features

- ✅ **Production-Ready**: Battle-tested configuration
- ✅ **Easy Setup**: 5-minute configuration
- ✅ **Comprehensive**: 5 different test types
- ✅ **Flexible**: Works with any REST API
- ✅ **Well-Documented**: Clear examples and guides
- ✅ **Performance Analysis**: Detailed metrics and recommendations

### Technical Details

- **Language**: JavaScript (ES6+)
- **Framework**: k6 by Grafana Labs
- **Node Version**: >= 16.0.0
- **License**: MIT
- **Test Coverage**: Smoke, Load, Stress, Spike, Soak

### Repository Structure

```
api-load-test/
├── config/           # Configuration files
├── tests/           # Test scenarios
├── utils/           # Helper utilities
├── sample-data/     # Test datasets
├── scripts/         # Utility scripts
└── reports/         # Test results (gitignored)
```

---

## [Unreleased]

### Planned Features

- [ ] Integration with CI/CD pipelines (GitHub Actions, GitLab CI)
- [ ] HTML report generation
- [ ] Grafana dashboard integration
- [ ] InfluxDB metrics export
- [ ] Docker support
- [ ] VS Code extension integration
- [ ] Real-time metrics visualization
- [ ] Multiple authentication methods (OAuth2, API keys)
- [ ] WebSocket testing support
- [ ] GraphQL testing support

---

## Version History

- **1.0.0** (2026-02-13) - Initial release

---

## How to Update

```bash
# Pull latest changes
git pull origin main

# Check for updates
npm update
```

## Migration Guides

### From v0.x to v1.0.0

This is the initial stable release. No migration needed.

---

For detailed changes in each version, see the [commit history](https://github.com/mahiiyh/api-load-test/commits/main).
