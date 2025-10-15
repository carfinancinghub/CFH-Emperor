// ----------------------------------------------------------------------
// File: adminFlow.spec.ts
// Path: cypress/integration/adminFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 12:45 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Cypress integration test for the Admin User Management slice (login → manage users → finalize transaction).
//
// @architectural_notes
// - **End-to-End**: Tests the full admin journey across frontend and backend.
// - **Mocked APIs**: Stubs API responses for consistent testing.
// - **Comprehensive**: Covers UI interactions, user management, and transaction finalization.
//
// @todos
// - @free:
//   - [x] Test admin’s journey end-to-end.
// - @premium:
//   - [ ] ✨ Test RBAC-based user management.
// - @wow:
//   - [ ] 🚀 Test AI-driven fraud detection alerts.
//
// ----------------------------------------------------------------------
describe('Admin User Management Slice', () => {
  beforeEach(() => {
    // Mock admin login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'admin-token', user: { id: 'admin123', roles: ['ADMIN'] } },
    }).as('login');
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    // Stub API calls
    cy.intercept('GET', '/api/admin/users', {
      statusCode: 200,
      body: {
        data: [{ _id: 'user123', name: 'Test User', email: 'user@example.com', roles: ['USER'], status: 'ACTIVE' }],
        meta: { page: 1, limit: 20, total: 1 },
      },
    }).as('getUsers');
    cy.intercept('PATCH', '/api/admin/users/user123/status', { statusCode: 200, body: { status: 'SUSPENDED' } }).as('updateUserStatus');
    cy.intercept('GET', '/api/v1/transactions', {
      statusCode: 200,
      body: {
        data: [{ _id: 'transaction123', auction: 'auction123', status: 'PENDING_SETTLEMENT', totalSalePrice: 10000 }],
        meta: { page: 1, limit: 20, total: 1 },
      },
    }).as('getTransactions');
    cy.intercept('POST', '/api/v1/transactions/finalize/auction123', {
      statusCode: 201,
      body: { message: 'Transaction finalized', data: { _id: 'transaction123' } },
    }).as('finalizeTransaction');
  });

  it('should allow an admin to manage users and finalize a transaction', () => {
    // Navigate to user management
    cy.visit('/admin/users');
    cy.wait('@getUsers');
    cy.contains('h1', 'User Management').should('be.visible');

    // Update user status
    cy.get('[data-testid="user-row"]').contains('Test User').should('be.visible');
    cy.get('[data-testid="user-row"]').contains('button', 'Suspend').click();
    cy.wait('@updateUserStatus');
    cy.get('[data-testid="user-row"]').contains('SUSPENDED').should('be.visible');

    // Navigate to transactions and finalize
    cy.visit('/admin/transactions');
    cy.wait('@getTransactions');
    cy.get('[data-testid="transaction-row"]').contains('transaction123').should('be.visible');
    cy.get('[data-testid="finalize-button"]').click();
    cy.wait('@finalizeTransaction');
    cy.get('[data-testid="transaction-row"]').contains('SETTLED').should('be.visible');
  });
});