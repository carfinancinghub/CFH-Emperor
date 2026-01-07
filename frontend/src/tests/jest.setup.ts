/**
 * src/tests/jest.setup.ts
 *
 * Loaded once per test file (via setupFilesAfterEnv).
 * Put global test helpers, matchers, and polyfills here.
 */

// React Testing Library matchers:
// Fixes: "expect(...).toBeInTheDocument is not a function" :contentReference[oaicite:4]{index=4}
import '@testing-library/jest-dom';

// Polyfill/stub browser APIs missing in jsdom:
// Fixes: "URL.createObjectURL is not a function" :contentReference[oaicite:5]{index=5}
if (typeof URL !== 'undefined' && typeof URL.createObjectURL !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (URL as any).createObjectURL = () => 'blob:jest-mock';
}

if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (URL as any).revokeObjectURL = () => undefined;
}
