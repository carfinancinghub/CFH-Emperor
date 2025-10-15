// ----------------------------------------------------------------------
// File: profileFlow.spec.ts
// Path: cypress/integration/profileFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 10:59 PDT
// Version: 1.0.1 (Added Seeding & Error Tests)
// ----------------------------------------------------------------------
// @description E2E test for user profile editing and viewing.
// @architectural_notes
// - **Seeding Note**: Requires `db:seed` task to create test user and auctions (e.g., via MongoDB script in `cypress/support/seed.js`).
// ----------------------------------------------------------------------
describe('User Profile Flow', () => {
  beforeEach(() => {
    cy.task('db:seed', {
      users: [{ email: 'user@test.com', password: 'password', name: 'Test User' }],
      auctions: [{ id: 'auction1', listing: { make: 'Ford', model: 'Mustang' }, bids: [{ bidder: 'user@test.com', amount: 5000 }] }],
    });
    cy.login('user@test.com', 'password');
    cy.visit('/profile');
  });

  it('should display the user profile information', () => {
    cy.contains('user@test.com').should('be.visible');
    cy.contains('My Active Listings').should('be.visible');
    cy.contains('My Bid History').should('be.visible');
    cy.contains('Bid on Ford').should('be.visible');
  });

  it('should allow a user to update their profile', () => {
    const newBio = 'This is my updated bio for testing purposes.';
    cy.get('textarea[name="bio"]').clear().type(newBio);
    cy.get('button[type="submit"]').click();
    
    cy.reload();
    cy.get('textarea[name="bio"]').should('have.value', newBio);
  });

  it('should handle invalid profile updates', () => {
    cy.get('input[name="avatar"]').type('invalid-url');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid input').should('be.visible');
  });
});