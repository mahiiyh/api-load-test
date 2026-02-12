/**
 * AgriGen ERP - Custom Scenario Example
 * 
 * This is a template for creating custom test scenarios.
 * Copy this file and modify it for your specific needs.
 * 
 * Run: k6 run tests/examples/custom-scenario.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { thresholds } from '../../config/thresholds.js';
import { loginAsAdmin } from '../../utils/auth.js';
import {
    checkResponse,
    authHeader,
    randomSleep,
    generateSalesOrder,
    log
} from '../../utils/helpers.js';

// Configure your test options
export const options = {
    // Define load pattern
    stages: [
        { duration: '1m', target: 5 },   // Ramp up
        { duration: '3m', target: 5 },   // Sustain
        { duration: '1m', target: 0 },   // Ramp down
    ],

    // Set performance thresholds
    thresholds: thresholds.standard,

    // Add test metadata
    tags: {
        test_type: 'custom',
        scenario: 'my_custom_scenario',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

// Setup function - runs once before test starts
export function setup() {
    log('Starting custom scenario test...', 'info');

    // Perform any setup (e.g., create test data, authenticate)
    const token = loginAsAdmin();

    if (!token) {
        throw new Error('Failed to authenticate during setup');
    }

    // Return data to be used by all VUs
    return {
        token,
        testData: {
            // Add any test data here
        }
    };
}

// Main test function - runs for each VU iteration
export default function (data) {
    const { token } = data;
    const headers = authHeader(token);

    // Example Scenario: Complete Sales Workflow
    group('Sales Workflow', () => {

        // Step 1: Browse inventory
        log('Browsing inventory...', 'info');
        const inventoryResponse = http.get(
            `${baseUrl}${config.endpoints.inventory.list}`,
            { headers }
        );

        checkResponse(inventoryResponse, 200, 'inventory retrieved');
        sleep(1);

        // Step 2: Create sales order
        log('Creating sales order...', 'info');
        const salesData = generateSalesOrder();
        const salesResponse = http.post(
            `${baseUrl}${config.endpoints.sales.create}`,
            JSON.stringify(salesData),
            { headers }
        );

        checkResponse(salesResponse, 201, 'sales order created');

        // Extract created order ID
        const createdOrder = JSON.parse(salesResponse.body || '{}');

        if (createdOrder.id) {
            sleep(1);

            // Step 3: Generate invoice
            log(`Generating invoice for order ${createdOrder.id}...`, 'info');
            const invoiceResponse = http.get(
                `${baseUrl}${config.endpoints.sales.invoice.replace(':id', createdOrder.id)}`,
                { headers }
            );

            checkResponse(invoiceResponse, 200, 'invoice generated');
        }

        sleep(2);
    });

    // Add more scenarios as needed
    group('Additional Operations', () => {
        // Your custom operations here

        // Example: Check reports
        if (Math.random() < 0.3) { // 30% of iterations
            const reportResponse = http.get(
                `${baseUrl}${config.endpoints.reports.sales}`,
                { headers }
            );

            checkResponse(reportResponse, 200, 'report retrieved');
        }
    });

    // Think time between iterations
    randomSleep(2, 5);
}

// Teardown function - runs once after test completes
export function teardown(data) {
    log('Custom scenario test completed', 'info');

    // Perform any cleanup here
    // e.g., delete test data, generate summary reports
}

/*
 * CUSTOMIZATION TIPS:
 * 
 * 1. Modify the stages in options to change load pattern
 * 2. Add or remove groups to test different scenarios
 * 3. Adjust sleep times to simulate realistic user behavior
 * 4. Use checks to validate responses
 * 5. Add custom metrics to track specific KPIs
 * 6. Use __ENV variables for runtime configuration
 * 
 * EXAMPLE USAGE:
 * 
 * # Run with default settings
 * k6 run tests/examples/custom-scenario.js
 * 
 * # Run against staging environment
 * k6 run -e ENVIRONMENT=staging tests/examples/custom-scenario.js
 * 
 * # Run with custom VUs
 * k6 run --vus 10 --duration 5m tests/examples/custom-scenario.js
 * 
 * # Generate report
 * k6 run --out json=reports/custom-results.json tests/examples/custom-scenario.js
 */
