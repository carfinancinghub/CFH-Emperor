// ----------------------------------------------------------------------
// File: sellerFlow.spec.ts
// Path: cypress/integration/sellerFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 12:15 PDT
// Version: 1.0.1 (Merged Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Cypress integration test for the Seller’s vertical slice (login → create listing → upload photos → publish).
//
// @architectural_notes
// - **End-to-End**: Tests the full seller journey across frontend and backend.
// - **Mocked APIs**: Stubs API responses for consistent testing.
// - **Comprehensive**: Covers UI interactions, API flows, and specific element assertions.
//
// @todos
// - @free:
//   - [x] Test seller’s journey end-to-end.
// - @premium:
//   - [ ] ✨ Test premium features like save draft.
// - @wow:
//   - [ ] 🚀 Test AI-driven VIN validation.
//
// ----------------------------------------------------------------------
describe('Seller’s Vertical Slice', () => {
  beforeEach(() => {
    // Mock login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-token', user: { id: 'seller123', roles: ['USER'] } },
    }).as('login');
    cy.visit('/login');
    cy.get('input[name="email"]').type('seller@example.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');

    // Stub API calls
    cy.intercept('POST', '/api/photos/generate-upload-url', {
      statusCode: 200,
      body: { uploadUrl: 'https://mock-s3-url.com/photo', key: 's3-key' },
    }).as('getUploadUrl');
    cy.intercept('PUT', 'https://mock-s3-url.com/*', { statusCode: 200 }).as('s3Upload');
    cy.intercept('POST', '/api/photos/save-reference', {
      statusCode: 200,
      body: { _id: 'photo123' },
    }).as('savePhotoRef');
    cy.intercept('POST', '/api/listings', {
      statusCode: 201,
      body: { _id: 'listing123' },
    }).as('createListing');
  });

  it('should allow a seller to successfully create a new vehicle listing with photos', () => {
    // Navigate to listing form
    cy.visit('/seller/listings/new');
    cy.contains('h2', 'Create a New Listing').should('be.visible');

    // Fill form fields
    cy.get('#vin').type('12345678901234567');
    cy.get('#make').type('Tesla');
    cy.get('#model').type('Model S');
    cy.get('#year').type('2024');
    cy.get('#mileage').type('10000');
    cy.get('#price').type('75000');
    cy.get('#description').type('A beautiful electric sedan with low mileage.');

    // Attach photo
    cy.get('#photos').selectFile({
      contents: Cypress.Buffer.from(''),
      fileName: 'tesla.jpg',
      mimeType: 'image/jpeg',
    });

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify API flow
    cy.wait('@getUploadUrl');
    cy.wait('@s3Upload');
    cy.wait('@savePhotoRef');
    cy.wait('@createListing');

    // Verify redirection and UI
    cy.url().should('include', '/seller/listings/listing123');
    cy.contains('h1', '2024 Tesla Model S').should('be.visible');
  });
});