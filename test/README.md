# 🧪 TEST SUITE

Comprehensive testing for all microservices.

## 📁 Structure

```
test/
├── unit/              # Unit tests for individual components
├── integration/       # Integration tests for service interactions
├── e2e/              # End-to-end tests for complete user flows
├── load/             # Load testing scripts (k6)
└── fixtures/         # Test data & mocks
```

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:cov
```

## 📖 Testing Guide

See: `docs/note/TESTING_ALL_SERVICES.md` for comprehensive guide.

