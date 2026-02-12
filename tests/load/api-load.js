/**
 * AgriGen ERP - API Load Test
 * 
 * Standard load test to verify system performance under expected load.
 * Simulates normal business hours with typical user distribution.
 * 
 * Run: k6 run tests/load/api-load.js
 * Or: npm run test:load
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { config } from '../../config/env.js';
import { thresholds } from '../../config/thresholds.js';
import { loginAsAdmin, loginAsUser, loginAsManager } from '../../utils/auth.js';
import {
    checkResponse,
    parseJSON,
    authHeader,
    randomSleep,
    generateInventoryItem,
    generateSalesOrder,
    generatePurchaseOrder
} from '../../utils/helpers.js';

export const options = {
    stages: [
        { duration: '2m', target: 10 },  // Ramp up to 10 users
        { duration: '5m', target: 10 },  // Stay at 10 users
        { duration: '2m', target: 20 },  // Ramp up to 20 users
        { duration: '5m', target: 20 },  // Stay at 20 users
        { duration: '2m', target: 0 },   // Ramp down to 0
    ],
    thresholds: thresholds.standard,
    tags: {
        test_type: 'load',
        environment: __ENV.ENVIRONMENT || 'dev'
    }
};

const baseUrl = config.getBaseUrl();

export function setup() {
    console.log('Starting load test setup...');
    const adminToken = loginAsAdmin();

    if (!adminToken) {
        throw new Error('Failed to authenticate admin during setup');
    }

    return { adminToken };
}

export default function (data) {
    const { adminToken } = data;

    // Use admin account for all virtual users (localhost environment)
    const userToken = adminToken;

    if (!userToken) {
        console.error('Failed to login');
        return;
    }

    const headers = authHeader(userToken);

    // Scenario 1: Browse Inventory (50% of users)
    if (Math.random() < 0.5) {
        group('Browse Inventory', () => {
            const inventoryResponse = http.get(
                `${baseUrl}${config.endpoints.inventory.list}`,
                { headers }
            );

            checkResponse(inventoryResponse, 200, 'inventory list retrieved');

            const inventory = parseJSON(inventoryResponse);
            if (inventory && inventory.data && inventory.data.length > 0) {
                const randomItem = inventory.data[Math.floor(Math.random() * inventory.data.length)];

                // View item details
                const itemResponse = http.get(
                    `${baseUrl}${config.endpoints.inventory.list}/${randomItem.id}`,
                    { headers }
                );

                checkResponse(itemResponse, 200, 'item details retrieved');
            }
        });

        randomSleep(1, 3);
    }

    // Scenario 2: Create Sales Order (30% of users)
    if (Math.random() < 0.3) {
        group('Create Sales Order', () => {
            const salesData = generateSalesOrder();

            const salesResponse = http.post(
                `${baseUrl}${config.endpoints.sales.create}`,
                JSON.stringify(salesData),
                { headers }
            );

            checkResponse(salesResponse, 201, 'sales order created');

            const createdOrder = parseJSON(salesResponse);
            if (createdOrder && createdOrder.id) {
                // Generate invoice
                const invoiceResponse = http.get(
                    `${baseUrl}${config.endpoints.sales.invoice.replace(':id', createdOrder.id)}`,
                    { headers }
                );

                checkResponse(invoiceResponse, 200, 'invoice generated');
            }
        });

        randomSleep(2, 4);
    }

    // Scenario 3: Create Purchase Order (20% of users)
    if (Math.random() < 0.2) {
        group('Create Purchase Order', () => {
            const purchaseData = generatePurchaseOrder();

            const purchaseResponse = http.post(
                `${baseUrl}${config.endpoints.purchase.create}`,
                JSON.stringify(purchaseData),
                { headers }
            );

            checkResponse(purchaseResponse, 201, 'purchase order created');

            const createdPO = parseJSON(purchaseResponse);
            if (createdPO && createdPO.id && Math.random() < 0.5) {
                // Approve purchase order
                const approveResponse = http.put(
                    `${baseUrl}${config.endpoints.purchase.approve.replace(':id', createdPO.id)}`,
                    null,
                    { headers }
                );

                checkResponse(approveResponse, 200, 'purchase order approved');
            }
        });

        randomSleep(2, 5);
    }

    // Scenario 4: View Reports (15% of users)
    if (Math.random() < 0.15) {
        group('View Reports', () => {
            const salesReportResponse = http.get(
                `${baseUrl}${config.endpoints.reports.sales}`,
                { headers }
            );

            checkResponse(salesReportResponse, 200, 'sales report retrieved');

            const inventoryReportResponse = http.get(
                `${baseUrl}${config.endpoints.reports.inventory}`,
                { headers }
            );

            checkResponse(inventoryReportResponse, 200, 'inventory report retrieved');
        });

        randomSleep(3, 6);
    }

    // Scenario 5: Check Account Balance (10% of users)
    if (Math.random() < 0.1) {
        group('Check Accounts', () => {
            const balanceResponse = http.get(
                `${baseUrl}${config.endpoints.accounts.balance}`,
                { headers }
            );

            checkResponse(balanceResponse, 200, 'account balance retrieved');
        });

        randomSleep(1, 2);
    }

    sleep(1);
}

export function teardown(data) {
    console.log('Load test completed');
}
