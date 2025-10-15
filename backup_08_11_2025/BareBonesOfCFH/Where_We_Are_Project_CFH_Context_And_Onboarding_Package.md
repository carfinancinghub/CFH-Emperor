📦 Project CFH: Context & Onboarding Package
This document contains the essential working principles, conventions, and workflow we've established for Project CFH.

1. Guiding Principles & Standards
Technology: All new code is TypeScript. The backend is a modular, service-oriented architecture. The frontend is a decoupled, hook-based component architecture.

Quality & Security: We prioritize security with Zod for input validation, secure cloud storage for files, and a focus on auditable, robust code.

Business Strategy: All feature development is guided by a Free, Premium, and Wow++ tiering philosophy. The goal is to provide industry-standard features for free and create compelling, high-value paid upgrades.

2. The Standardized Comment Block
All new files must begin with this exact header format, updated with the file's specific details.

TypeScript

// ----------------------------------------------------------------------
// File: [FileName.ts]
// Path: [backend/or/frontend/path/to/FileName.ts]
// Author: [Author Name]
// Created: [Date] at [Time] [Timezone]
// Version: [Version Number] ([Descriptor])
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// [A brief, one-sentence description of the file's purpose.]
//
// @architectural_notes
// - [A bullet point explaining a key architectural decision or pattern.]
// - [Another bullet point, if necessary.]
//
// @todos
// - @free:
//   - [ ] [A task for the standard, free version of the feature.]
// - @premium:
//   - [ ] ✨ [A task for a high-value, paid version of the feature.]
// - @wow:
//   - [ ] 🚀 [A task for a "dream" or AI-powered version of the feature.]
//
// ----------------------------------------------------------------------
3. Our Established Workflow ("The Driving Logic")
We have established a highly effective, iterative workflow:

Propose Module: I propose the next logical module from the backlog.

Analyze Existing Files: I search the project's file manifests for relevant existing code and request specific files from you by their full path.

Architect & Enhance: I analyze the provided files and architect a new, superior version that incorporates our standards and the tiered business strategy.

Generate Code: I provide the complete code for the new/enhanced files, typically in logical batches of 2-4 files at a time.

Update Status: I present an updated Project Status Report to mark our progress before proposing the next module.

4. Technical Conventions
Backend Path Aliases: All backend import paths use the @/ alias, which resolves to the backend/ root directory (e.g., @/services/MyService). There is no src folder in the backend.

File Naming: All files use PascalCase (e.g., MyService.ts, MyComponent.tsx).