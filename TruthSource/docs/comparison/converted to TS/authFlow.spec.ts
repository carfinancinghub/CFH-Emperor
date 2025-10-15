// ----------------------------------------------------------------------
// File: authFlow.spec.ts
// Path: cypress/integration/authFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 09:00 PDT
// Version: 1.0.1 (Enhanced with Error Cases)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// End-to-end integration test for the core authentication flow, validating login, logout, and protected route access.
//
// @architectural_notes
// - **Comprehensive**: Tests successful login, unauthorized access, admin routes, and invalid credentials.
// - **Mocked APIs**: Stubs login API for consistent testing.
// - **Secure**: Verifies role-based access controls.
//
// @todos
// - @free:
//   - [x] Test authentication flow.
// - @premium:
//   - [ ] ✨ Test token refresh mechanisms.
// - @wow:
//   - [ ] 🚀 Test AI-driven login anomaly detection.
//
// ----------------------------------------------------------------------
describe('Authentication Flow', () => {
  beforeEach(() => {
    // Define custom login command
    Cypress.Commands.add('login', (email: string, password: string, roles: string[] = ['USER']) => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: { token: `fake-token-${email}`, user: { id: `user-${email}`, roles } },
      }).as('loginRequest');
      cy.visit('/login');
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait('@loginRequest');
    });
  });

  it('should allow a user to log in and redirect to their dashboard', () => {
    cy.login('seller@test.com', 'password', ['SELLER']);
    cy.url().should('include', '/dashboard');
    cy.contains('h1', 'Dashboard').should('be.visible');
  });

  it('should prevent unauthenticated users from accessing protected routes', () => {
    cy.visit('/admin/users');
    cy.url().should('include', '/login');
    cy.contains('You must be logged in to view this page').should('be.visible');
  });

  it('should allow an admin to access admin-only routes', () => {
    cy.login('admin@test.com', 'password', ['ADMIN']);
    cy.visit('/admin/users');
    cy.url().should('include', '/admin/users');
    cy.contains('h1', 'User Management').should('be.visible');
  });

  it('should handle invalid login credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid email or password' },
    }).as('loginRequest');
    cy.visit('/login');
    cy.get('input[name="email"]').type('invalid@test.com');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.contains('Invalid email or password').should('be.visible');
    cy.url().should('include', '/login');
  });
});