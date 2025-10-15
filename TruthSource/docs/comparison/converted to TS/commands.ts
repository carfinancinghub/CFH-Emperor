// ----------------------------------------------------------------------
// File: commands.ts
// Path: cypress/support/commands.ts
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 18:00 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Custom Cypress commands for testing Project CFH.
//
// @architectural_notes
// - **Reusable**: Defines reusable commands like login for integration tests.
// - **Extensible**: Supports additional commands for future test needs.
//
// @todos
// - @free:
//   - [x] Add login command.
// - @premium:
//   - [ ] ✨ Add commands for premium feature testing.
// - @wow:
//   - [ ] 🚀 Add AI-driven test automation commands.
//
// ----------------------------------------------------------------------
import { addCustomCommand } from 'cypress/support';

Cypress.Commands.add('login', (email: string, password: string, roles: string[] = ['USER']) => {
  // Implemented in authFlow.spec.ts to avoid duplication
});