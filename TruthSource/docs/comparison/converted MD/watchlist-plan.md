----------------------------------------------------------------------
File: watchlist-plan.md
Path: docs/watchlist-plan.md
Author: Gemini & SG Man, System Architects
Created: August 15, 2025 at 11:20 PDT
Version: 1.0.1 (Added Validation & Metrics)
----------------------------------------------------------------------

@description
Formal plan for the auction watchlist feature to improve user engagement.

@architectural_notes
- Scalable: Uses MongoDB $addToSet/$pull for watchlist management.
- Stateful Frontend: useWatchlist with React Context for global state.
- User-Centric: Authenticated endpoints for user-specific data.
- Auditable: Logs actions to HistoryService.

@todos
- @free:
- [x] Define model changes and endpoints.
- [x] Design watchlist page and components.
- [x] Set performance metrics.
- @premium:
- [ ] ✨ Add email notifications for watched auctions.
- @wow:
- [ ] 🚀 Implement price drop alerts.

----------------------------------------------------------------------
1. Data Model Changes

User.ts:
watchlist: [ObjectId] (ref: Auction)



2. Backend API

Endpoints (under /api/v1/watchlist, protected by authMiddleware):
GET /api/v1/watchlist: Returns populated watchlist.
POST /api/v1/watchlist/:auctionId: Adds auction, validated by Zod.
DELETE /api/v1/watchlist/:auctionId: Removes auction, validated by Zod.


Validation: Zod schema for auctionId.

3. Frontend Implementation

useWatchlist.ts: Context provider for watchlist state, with error handling.
WatchlistPage.tsx: Displays watched auctions with empty state message.
AuctionListPage.tsx & AuctionDetailPage.tsx: Add WatchButton with ARIA attributes.
App.tsx: Wraps app in WatchlistProvider, adds “My Watchlist” link.

4. Performance Metrics

API Response Time: <300ms for POST/DELETE, <700ms for GET.
Frontend Update: UI updates in <50ms.
Engagement: 20% of users add auctions to watchlist weekly.
