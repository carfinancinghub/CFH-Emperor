// ----------------------------------------------------------------------
// File: toolingBucket.ts
// Path: docs/buckets/toolingBucket.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// An archive and idea bucket for specialized utilities and developer tools
// that are not part of the core web application but may be useful for
// future projects or internal CLIs.
//
// ----------------------------------------------------------------------

interface IArchivedUtility {
  name: string;
  originalPath: string;
  reasonForArchival: string;
  potentialReactivation?: string;
  ticketId?: string;
}

/**
 * Lists archived utilities that do not fit into the core application.
 */
export const utilitiesArchived: IArchivedUtility[] = [
  {
    name: 'placeholder.js',
    originalPath: 'backend/utils/cli/placeholder.js',
    reasonForArchival: 'This is a utility for creating styled inputs in a command-line interface (CLI). Our core product is a web application.',
    potentialReactivation: 'Could be reactivated if we decide to build a dedicated CLI for managing the application (e.g., `carhub-cli`).',
    ticketId: 'TOOL-001'
  },
  {
    name: 'placeholders.js',
    originalPath: 'backend/utils/ast/placeholders.js',
    reasonForArchival: 'This is a low-level utility for code transpilers (like Babel) that manage Abstract Syntax Trees. It is not used in our application logic.',
    potentialReactivation: 'Could be used if we ever build custom code-generation scripts or a domain-specific language (DSL) for our platform.',
    ticketId: 'TOOL-002'
  }
];