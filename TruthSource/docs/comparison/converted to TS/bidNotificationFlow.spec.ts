// ----------------------------------------------------------------------
// File: bidNotificationFlow.spec.ts
// Path: cypress/integration/bidNotificationFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 07:38 PDT
// Version: 1.0.1 (Enhanced with Seeding Notes & Failure Tests)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// End-to-end test for validating real-time bid notifications.
//
// @architectural_notes
// - **User Simulation**: Simulates two distinct users interacting with the same auction.
// - **Real-Time Validation**: Checks for DOM updates without reloading the page.
// - **API Interaction**: Uses cy.request() to trigger backend events as a secondary user.
// - **Seeding Note**: Requires a `db:seed` task to create a test auction and users (e.g., via MongoDB script in `cypress/support/seed.js`).
//
// @todos
// - @free:
//   - [x] Test that a new bid appears in real-time for other users.
// - @premium:
//   - [ ] ✨ Test with multiple simultaneous bidders.
// - @wow:
//   - [ ] 🚀 Add performance test to measure notification latency.
//
// ----------------------------------------------------------------------
describe('Real-Time Bid Notification Flow', () => {
  let auctionId: string;
  let user1Token: string;
  let user2Token: string;

  beforeEach(() => {
    // Seed the database with a test auction and two users
    cy.task('db:seed', { auction: { id: 'auction123', listing: { photos: [] } }, users: ['user1@test.com', 'user2@test.com'] }).then((seeds) => {
      auctionId = seeds.auctionId;
      // Log in as both users to get their tokens
      cy.login('user1@test.com', 'password').then((token) => {
        user1Token = token;
      });
      cy.login('user2@test.com', 'password').then((token) => {
        user2Token = token;
      });
    });
  });

  it('should display new bids to other users in real-time without a page refresh', () => {
    // Step 1: User 1 visits the auction page
    cy.visit(`/auctions/${auctionId}`);
    cy.contains('Current Bids').should('be.visible');

    // Initially, there should be no bids from User 2
    cy.contains('Bidder: User2').should('not.exist');
    
    // Step 2: User 2 places a bid via API request
    const bidAmount = 15000;
    cy.request({
      method: 'POST',
      url: `/api/v1/auctions/${auctionId}/bids`,
      headers: {
        Authorization: `Bearer ${user2Token}`,
      },
      body: {
        amount: bidAmount,
      },
    }).its('status').should('equal', 201);

    // Step 3: Verify User 1's page updates in real-time
    cy.get('ul').within(() => {
      cy.contains('Bidder: User2').should('be.visible');
      cy.contains(`$${bidAmount.toFixed(2)}`).should('be.visible');
    });

    // Final check: ensure the page was not reloaded
    cy.window().its('performance.navigation.type').should('not.equal', 1); // 1 = TYPE_RELOAD
  });

  it('should handle WebSocket connection failure gracefully', () => {
    // Simulate WebSocket failure by intercepting connection
    cy.intercept('GET', '/socket.io/*', { statusCode: 500 });
    cy.visit(`/auctions/${auctionId}`);
    cy.contains('Current Bids').should('be.visible');
    cy.window().its('console.error').should('be.calledWith', 'WebSocket connection error:');
  });
});