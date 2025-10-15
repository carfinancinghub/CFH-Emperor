// ----------------------------------------------------------------------
// File: ratingsFlow.spec.ts
// Path: cypress/integration/ratingsFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:49 PDT
// Version: 1.0.1 (Added Seeding & Comment Block)
// ----------------------------------------------------------------------
// @description
// E2E test for user ratings submission and display post-transaction.
//
// @architectural_notes
// - **Seeding**: Uses `db:seed` to create test user, auction, and transaction.
// - **End-to-End**: Validates the full rating lifecycle from finalization to display.
//
// @dependencies cypress
//
// @todos
// - @free:
//   - [x] Test rating submission and display.
//   - [x] Add seeding for consistent tests.
// - @premium:
//   - [ ] ✨ Test rating responses.
// - @wow:
//   - [ ] 🚀 Test rating moderation scenarios.
// ----------------------------------------------------------------------
describe('User Ratings Flow', () => {
  let auctionId: string;
  let transactionId: string;

  beforeEach(() => {
    cy.task('db:seed', {
      users: [
        { email: 'admin@test.com', password: 'password', name: 'Admin', roles: ['ADMIN'] },
        { email: 'buyer@test.com', password: 'password', name: 'Buyer' },
        { email: 'seller@test.com', password: 'password', name: 'Seller' },
      ],
      auctions: [{ id: 'auction123', listing: { make: 'Ford', model: 'Mustang', year: 2023, seller: 'seller@test.com' }, bids: [{ bidder: 'buyer@test.com', amount: 50000 }] }],
    }).then(seeds => {
      auctionId = seeds.auctions[0].id;
    });
    cy.login('admin@test.com', 'password');
    cy.task('finalizeAuction', { auctionId }).then(result => {
      transactionId = result.transactionId;
    });
  });

  it('allows users to rate each other after a transaction is finalized', () => {
    cy.login('buyer@test.com', 'password');
    cy.visit('/profile');
    cy.get('.pending-ratings').should('exist');
    
    cy.get('.pending-ratings form').within(() => {
      cy.get('input[name="rating"]').type('5');
      cy.get('textarea[name="review"]').type('Great seller!');
      cy.root().submit();
    });

    cy.get('.pending-ratings').should('not.exist');
    cy.visit('/profile');
    cy.get('[data-testid="ratings-tab"]').click();
    cy.contains('Great seller!').should('be.visible');
    cy.contains('5.0 ★').should('be.visible');
  });

  it('handles invalid rating submissions gracefully', () => {
    cy.login('buyer@test.com', 'password');
    cy.visit('/profile');
    cy.get('.pending-ratings form').within(() => {
      cy.get('input[name="rating"]').type('6'); // Invalid rating
      cy.get('textarea[name="review"]').type('Great seller!');
      cy.root().submit();
    });
    cy.contains('Rating must be between 1 and 5').should('be.visible');
  });
});