# Wave-20 Proofs — App TSX Entry + CI

Branch: review/app-tsx-import-fix
Timestamp: 2026-01-04 15:44:20

## What was fixed
- TS-only app entry: App.jsx removed; App.tsx is the entrypoint.
- TS-only Vite entry: index.html loads /src/index.tsx (index.jsx removed).
- index.html rewritten clean UTF-8 (removed control-character parse5 warning).
- Local test-logs artifacts removed from git tracking (repo hygiene).
- reports/proofs allowlisted for SG-Man review.

## Proof logs
- Vite build log(s): reports/proofs/wave20-app-tsx-fix/
- CI-AI log(s):      reports/proofs/wave20-ci/

## Expected status
- npm run build: PASS
- npm run ci-ai: PASS
