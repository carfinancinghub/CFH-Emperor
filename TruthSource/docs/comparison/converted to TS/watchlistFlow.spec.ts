// ----------------------------------------------------------------------
// File: watchlistFlow.spec.ts
// Path: cypress/integration/watchlistFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:25 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
describe('Auction Watchlist Flow', () => {
  let auctionId: string;

  beforeEach(() => {
    cy.task('db:seed').then(seeds => {
      auctionId = seeds.auctionId;
    });
    cy.login('user@test.com', 'password');
  });

  it('allows a user to add, view, and remove an auction from their watchlist', () => {
    // 1. Add to watchlist from list page
    cy.visit('/auctions');
    cy.get(`[data-auction-id="${auctionId}"] .watch-button`).click();

    // 2. Verify it's on the watchlist page
    cy.visit('/watchlist');
    cy.get(`[data-auction-id="${auctionId}"]`).should('exist');

    // 3. Remove from watchlist
    cy.visit('/auctions');
    cy.get(`[data-auction-id="${auctionId}"] .watch-button`).click();
    
    // 4. Verify it's gone from the watchlist page
    cy.visit('/watchlist');
    cy.get(`[data-auction-id="${auctionId}"]`).should('not.exist');
  });
});