/**
 * Environment Configuration for AgriGen ERP Load Tests
 * 
 * This file contains environment-specific configurations.
 * Update the BASE_URL and other settings based on your environment.
 */

export const config = {
  // Base URLs for different environments
  environments: {
    dev: 'http://localhost:5000',
    staging: 'https://staging.agrigen.com',
    production: 'https://api.agrigen.com',
    agrigen_api: 'http://20.198.232.178:8170'  // AgriGen ERP API Server
  },

  // Get current environment from ENV variable or default to dev
  getCurrentEnvironment() {
    return __ENV.ENVIRONMENT || 'agrigen_api';
  },

  // Get base URL for current environment
  getBaseUrl() {
    const env = this.getCurrentEnvironment();
    return this.environments[env] || this.environments.agrigen_api;
  },

  // API endpoints
  endpoints: {
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh'
    },
    attendance: {
      bulkUpload: '/swagger/api/CheckrollAttendanceBulkUpload/SavePluckingCheckrollAttendanceBulkUpload'
    },
    inventory: {
      list: '/api/inventory',
      create: '/api/inventory',
      update: '/api/inventory/:id',
      delete: '/api/inventory/:id'
    },
    sales: {
      list: '/api/sales',
      create: '/api/sales',
      invoice: '/api/sales/:id/invoice'
    },
    purchase: {
      list: '/api/purchase',
      create: '/api/purchase',
      approve: '/api/purchase/:id/approve'
    },
    accounts: {
      ledger: '/api/accounts/ledger',
      balance: '/api/accounts/balance',
      trial: '/api/accounts/trial-balance'
    },
    reports: {
      sales: '/api/reports/sales',
      inventory: '/api/reports/inventory',
      financial: '/api/reports/financial'
    }
  },

  // Default headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  // Test data
  testUsers: {
    admin: {
      username: 'Admin',
      password: 'Agr@2025'
    }
  }
};

export default config;
