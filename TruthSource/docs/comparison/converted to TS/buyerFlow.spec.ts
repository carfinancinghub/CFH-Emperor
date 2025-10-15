// ----------------------------------------------------------------------
// File: buyerFlow.spec.ts
// Path: cypress/integration/buyerFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 17:00 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Cypress integration test for the Buyer’s vertical slice (view auctions → bid → finalize transaction).
//
// @architectural_notes
// - **End-to-End**: Tests the full buyer journey across frontend and backend.
// - **Mocked APIs**: Stubs API responses for consistent testing.
// - **Comprehensive**: Covers UI interactions and API flows.
//
// @todos
// - @free:
//   - [x] Test buyer’s journey end-to-end.
// - @premium:
//   - [ ] ✨ Test premium features like real-time bid updates.
// - @wow:
//   - [ ] 🚀 Test AI-driven bid suggestions.
//
// ----------------------------------------------------------------------
describe('Buyer’s Vertical Slice', () => {
  beforeEach(() => {
    // Mock login
    cy.intercept('POST', '/api/auth/login', { statusCode: 200, body: { token: 'fake-token', user: { id: 'user123', roles: ['USER'] } } }).as('login');
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
  });

  it('should allow a buyer to view auctions, bid, and view finalized transaction', () => {
    // Mock auction list
    cy.intercept('GET', '/api/v1/auctions', {
      statusCode: 200,
      body: {
        data: [{ _id: 'auction123', listing: { make: 'Test', model: 'Car', year: 2023, photos: [{ url: 'photo.jpg' }] }, auctionType: 'SALE', endTime: new Date(Date.now() + 86400000).toISOString() }],
        meta: { page: 1, limit: 20, total: 1 },
      },
    }).as('getAuctions');

    // Mock auction details
    cy.intercept('GET', '/api/v1/auctions/auction123', {
      statusCode: 200,
      body: { data: { _id: 'auction123', listing: { make: 'Test', model: 'Car', year: 2023 }, bids: [] } },
    }).as('getAuctionDetails');

    // Mock bid submission
    cy.intercept('POST', '/api/v1/auctions/auction123/bids', { statusCode: 201, body: { message: 'Bid placed' } }).as('placeBid');

    // Mock transaction list
    cy.intercept('GET', '/api/v1/transactions', {
      statusCode: 200,
      body: {
        data: [{ _id: 'transaction123', auction: 'auction123', status: 'SETTLED', totalSalePrice: 10000 }],
        meta: { page: 1, limit: 20, total: 1 },
      },
    }).as('getTransactions');

    // Navigate to auction list
    cy.visit('/auctions');
    cy.wait('@getAuctions');
    cy.get('[data-testid="auction-card"]').click();
    cy.wait('@getAuctionDetails');

    // Place a bid
    cy.get('input[name="amount"]').type('50000');
    cy.get('button[type="submit"]').click();
    cy.wait('@placeBid');

    // Mock admin login for transaction finalization
    cy.intercept('POST', '/api/auth/login', { statusCode: 200, body: { token: 'admin-token', user: { id: 'admin123', roles: ['ADMIN'] } } }).as('adminLogin');
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    cy.wait('@adminLogin');

    // Mock transaction finalization
    cy.intercept('POST', '/api/v1/transactions/finalize/auction123', { statusCode: 201, body: { message: 'Transaction finalized', data: { _id: 'transaction123' } } }).as('finalizeTransaction');
    cy.visit('/admin/transactions');
    cy.get('[data-testid="finalize-button"]').click();
    cy.wait('@finalizeTransaction');

    // View transactions
    cy.visit('/transactions');
    cy.wait('@getTransactions');
    cy.get('[data-testid="transaction-row"]').should('contain', 'transaction123');
  });
});