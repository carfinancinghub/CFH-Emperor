----------------------------------------------------------------------
File: ratings-plan.md
Path: docs/ratings-plan.md
Author: Gemini & SG Man, System Architects
Created: August 15, 2025 at 11:45 PDT
Version: 1.0.1 (Added Validation & Metrics)
----------------------------------------------------------------------

@description
Formal plan for the user ratings and reputation system to build trust in the CFH marketplace.

@architectural_notes
- Transaction-Coupled: Ratings are triggered post-transaction via PendingRating entries.
- Reputation Calculation: reputationScore is computed as the average of received ratings, updated via ratingsController.
- Validated: Zod schema ensures rating integrity for submission.
- Auditable: Logs rating actions to HistoryService for tracking.

@todos
- @free:
- [x] Define Rating and PendingRating models.
- [x] Specify API endpoints.
- [x] Outline reputation calculation.
- @premium:
- [ ] ✨ Add public responses to ratings.
- @wow:
- [ ] 🚀 Implement AI-driven review sentiment analysis.

----------------------------------------------------------------------
1. Data Models

Rating.ts:
fromUser, toUser: ObjectId (ref: User)
auction: ObjectId (ref: Auction)
rating: Number (1-5)
review: String (maxLength: 500)


PendingRating.ts:
transaction: ObjectId (ref: Transaction)
fromUser, toUser: ObjectId (ref: User)


User.ts:
reputationScore: Number (default: 0, indexed)



2. Backend Logic

TransactionService.finalizeAuction: Creates PendingRating entries for buyer and seller.
ratingsController.submitRating:
Validates input with Zod.
Creates Rating, deletes PendingRating, updates reputationScore.


Reputation Calculation: Averages ratings for toUser.

3. API Endpoints

POST /api/v1/ratings: Submits rating (authenticated).
GET /api/v1/ratings/user/:userId: Fetches user ratings.
GET /api/v1/ratings/pending: Fetches pending ratings (authenticated).

4. Frontend Implementation

ProfilePage.tsx: Adds “Ratings” tab for pending/received ratings.
useRatings.ts: Manages rating data and submission.
AuctionListPage.tsx, AuctionDetailPage.tsx: Display reputationScore.

5. Performance Metrics

Response Time: <300ms for rating submission.
Engagement: 30% of users submit ratings post-transaction.
