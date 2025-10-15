// ----------------------------------------------------------------------
// File: notificationsFlow.spec.ts
// Path: cypress/integration/notificationsFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:34 PDT
// Version: 1.0.1 (Added Seeding & Error Tests)
// ----------------------------------------------------------------------
// @description E2E test for notification subscription and receipt.
// @dependencies cypress
// @note Requires `db:seed` task to create test user (e.g., via `cypress/support/seed.js`).
// ----------------------------------------------------------------------
describe('Push Notifications Flow', () => {
  beforeEach(() => {
    cy.task('db:seed', {
      users: [{ email: 'user@test.com', password: 'password', name: 'Test User' }],
    });
    cy.login('user@test.com', 'password');
  });

  it('should request permission and subscribe the user on grant', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.Notification, 'requestPermission').resolves('granted').as('requestPermission');
        cy.stub(win, 'ServiceWorkerRegistration').returns({
          showNotification: cy.stub().as('showNotification'),
        });
      },
    });

    cy.intercept('POST', '/api/v1/notifications/subscribe').as('subscribe');
    cy.get('@requestPermission').should('be.called');
    cy.wait('@subscribe').its('request.body.token').should('exist');
  });

  it('should handle denied permission gracefully', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.Notification, 'requestPermission').resolves('denied').as('requestPermission');
      },
    });

    cy.intercept('POST', '/api/v1/notifications/subscribe').as('subscribe');
    cy.get('@requestPermission').should('be.called');
    cy.get('@subscribe').should('not.exist');
  });
});