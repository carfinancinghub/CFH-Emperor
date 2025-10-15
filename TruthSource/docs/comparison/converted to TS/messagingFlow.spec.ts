// ----------------------------------------------------------------------
// File: messagingFlow.spec.ts
// Path: cypress/integration/messagingFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:25 PDT
// Version: 1.0.1 (Added Seeding Notes)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description E2E test for the in-app messaging flow.
// @architectural_notes
// - **Seeding Note**: Requires `db:seed` task to create test auction and users (e.g., via MongoDB script in `cypress/support/seed.js`).
// ----------------------------------------------------------------------
describe('In-App Messaging Flow', () => {
  let auctionId: string;

  beforeEach(() => {
    cy.task('db:seed', { auction: { id: 'auction123', listing: { photos: [], make: 'Test', model: 'Car', year: 2023 }, users: ['buyer@test.com', 'seller@test.com'] }).then((seeds) => {
      auctionId = seeds.auctionId;
    });
  });

  it('allows a buyer to contact a seller and exchange messages', () => {
    cy.login('buyer@test.com', 'password');
    cy.visit(`/auctions/${auctionId}`);
    cy.contains('Contact Seller').click();
    
    cy.url().should('include', '/inbox/');
    cy.contains('Select a conversation').should('not.exist');

    const buyerMessage = 'Hello, is this still available?';
    cy.get('input[placeholder="Type a message..."]').type(buyerMessage);
    cy.get('form').submit();
    cy.contains(buyerMessage).should('be.visible');

    cy.login('seller@test.com', 'password');
    cy.visit('/inbox');
    cy.contains('Test Car').click();
    cy.contains(buyerMessage).should('be.visible');

    const sellerReply = 'Yes, it is!';
    cy.get('input[placeholder="Type a message..."]').type(sellerReply);
    cy.get('form').submit();
    cy.contains(sellerReply).should('be.visible');
  });
});