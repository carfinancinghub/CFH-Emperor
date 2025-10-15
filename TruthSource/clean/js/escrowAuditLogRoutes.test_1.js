# 🧪 Test File: escrowAuditLogRoutes.test.js

## Purpose
Validate routes for audit log and blockchain sync (POST, GET) for escrow audit logging.

## Test Scenarios

### POST /api/escrow/audit/log
- ✅ Logs to DB via `syncEscrowAction`
- ✅ Syncs to blockchain if `isPremium=true`
- ❌ Returns 400 on invalid inputs
- ❌ Returns 500 on internal errors

### GET /api/escrow/audit/logs
- ✅ Fetches logs from DB via `getEscrowStatus`
- ✅ Fetches blockchain audit trail if `isPremium=true`
- ❌ Returns 500 on backend error

## Dependencies
- `@services/escrow/EscrowChainSync` (mocked)
- `@utils/logger` (mocked)
- `jest`, `supertest`, `express`
