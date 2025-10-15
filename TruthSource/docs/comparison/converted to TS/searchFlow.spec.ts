// ----------------------------------------------------------------------
// File: searchFlow.spec.ts
// Path: cypress/integration/searchFlow.spec.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:32 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description E2E test for the advanced search and filtering flow.
// ----------------------------------------------------------------------
describe('Advanced Search and Filtering Flow', () => {
  beforeEach(() => {
    // Seed DB with multiple vehicles:
    // - 2022 Ford Mustang ($55000)
    // - 2021 Toyota Camry ($32000)
    // - 2019 Ford F-150 ($45000)
    cy.task('db:seed:search'); 
    cy.visit('/auctions');
  });

  it('should filter auctions by make', () => {
    cy.get('input[name="make"]').type('Ford');
    cy.contains('Mustang').should('be.visible');
    cy.contains('F-150').should('be.visible');
    cy.contains('Camry').should('not.exist');
  });

  it('should filter by a combination of year and price', () => {
    cy.get('input[name="yearMin"]').type('2020');
    cy.get('input[name="maxPrice"]').type('50000');
    cy.contains('Camry').should('be.visible');
    cy.contains('Mustang').should('not.exist'); // Price is too high
    cy.contains('F-150').should('not.exist'); // Year is too old
  });
});