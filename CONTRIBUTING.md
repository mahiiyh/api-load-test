# Contributing to API Load Test

First off, thank you for considering contributing to API Load Test! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **k6 version** (`k6 version`)
- **OS and version**
- **Test script** (if applicable)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear use case** - Why is this needed?
- **Proposed solution** - How would it work?
- **Alternatives considered** - Other approaches you've thought about

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following the code style
3. **Add tests** if applicable
4. **Update documentation** if needed
5. **Ensure tests pass**
6. **Submit a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/api-load-test.git
cd api-load-test

# Install dependencies
npm install

# Run tests
npm run test:smoke
```

## Code Style

- Use **ES6+ JavaScript**
- Follow **k6 best practices**
- Add **comments** for complex logic
- Keep functions **small and focused**
- Use **descriptive variable names**

### Example Test Structure

```javascript
import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { getEnvironment } from '../../config/env.js';
import { login } from '../../utils/auth.js';

export const options = {
  // Test configuration
};

export function setup() {
  // Setup logic
}

export default function() {
  // Test logic
}

export function teardown(data) {
  // Cleanup logic
}
```

## Adding New Test Scenarios

When adding a new test scenario:

1. **Create test file** in appropriate directory (`tests/smoke/`, `tests/load/`, etc.)
2. **Follow naming convention**: `{feature}-{scenario}.js`
3. **Add npm script** in `package.json`
4. **Document in README** with use case and example
5. **Include sample data** if needed

## Documentation

- Keep README.md up to date
- Add inline comments for complex logic
- Update CHANGELOG.md for notable changes
- Include examples for new features

## Testing Guidelines

- Test against your own API endpoints (don't use production!)
- Verify all test types work (smoke, load, stress, spike, soak)
- Check that thresholds are reasonable
- Ensure error handling works correctly

## Commit Messages

Use clear, descriptive commit messages:

```
Add bulk upload stress test

- Implements progressive load testing for bulk endpoints
- Adds sample data with 10/50/100 records
- Includes performance benchmarks and thresholds
```

## Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge

## Community

- Be respectful and welcoming
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)
- Help others in issues and discussions

## Questions?

Feel free to open an issue with the `question` label.

Thank you for contributing! 🚀
