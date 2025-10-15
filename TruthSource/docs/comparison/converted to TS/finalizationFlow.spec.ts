// ----------------------------------------------------------------------
// File: finalizationFlow.spec.ts
// Path: cypress/integration/finalizationFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 17:00 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Cypress integration test for the Finalization & Auditing slice (login → finalize transaction → view transaction details).
//
// @architectural_notes
// - **End-to-End**: Tests the full finalization workflow across frontend and backend.
// - **Mocked APIs**: Stubs API responses for consistent testing.
// - **Comprehensive**: Covers admin UI interactions, transaction finalization, and detail views.
//
// @todos
// - @free:
//   - [x] Test finalization and transaction detail flow.
// - @premium:
//   - [ ] ✨ Test PDF report generation.
// - @wow:
//   - [ ] 🚀 Test AI-driven fraud detection alerts.
//
// ----------------------------------------------------------------------
describe('Finalization & Auditing Slice', () => {
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
    cy.intercept('GET', '/api/v1/transactions', {
      statusCode: 200,
      body: {
        data: [{ _id: 'transaction123', auction: 'auction123', status: 'PENDING_SETTLEMENT', totalSalePrice: 10000 }],
        meta: { page: 1, limit: 20, total: 1 },
      },
    }).as('getTransactions');
    cy.intercept('POST', '/api/v1/transactions/finalize/auction123', {
      statusCode: 201,
      body: { message: 'Transaction finalized', data: { _id: 'transaction123', status: 'SETTLED' } },
    }).as('finalizeTransaction');
    cy.intercept('GET', '/api/v1/transactions/transaction123', {
      statusCode: 200,
      body: {
        data: {
          _id: 'transaction123',
          auction: { _id: 'auction123', listing: { make: 'Test', model: 'Car', year: 2023 } },
          status: 'SETTLED',
          totalSalePrice: 10000,
          totalServiceFees: 1000,
          platformCommission: 500,
          payouts: [{ payee: { name: 'Seller' }, amount: 9500, status: 'PENDING' }],
        },
      },
    }).as('getTransactionDetails');
  });

  it('should allow an admin to finalize a transaction and view its details', () => {
    // Navigate to transaction list
    cy.visit('/admin/transactions');
    cy.wait('@getTransactions');
    cy.contains('h1', 'Transaction Reports').should('be.visible');

    // Finalize transaction
    cy.get('[data-testid="transaction-row"]').contains('transaction123').should('be.visible');
    cy.get('[data-testid="finalize-button"]').click();
    cy.wait('@finalizeTransaction');
    cy.get('[data-testid="transaction-row"]').contains('SETTLED').should('be.visible');

    // View transaction details
    cy.get('[data-testid="transaction-row"]').click();
    cy.wait('@getTransactionDetails');
    cy.url().should('include', '/transactions/transaction123');
    cy.contains('h1', 'Transaction transaction123').should('be.visible');
    cy.contains('Test Car').should('be.visible');
    cy.contains('$10000.00').should('be.visible');
  });
});