# 🏛️ Car Financing Hub (CFH) - Final Architectural Blueprint

This document outlines the complete, definitive architecture for the CFH platform as of August 11, 2025.

---

##  Core Infrastructure

### Backend
- `backend/server.ts`: The main, clustered, and secure backend server.
- `backend/models/User.ts`: The definitive, unified User model.
- `backend/services/authService.ts`: Core service for authentication logic.
- `backend/controllers/authController.ts`: Controller for handling login/registration API requests.
- `backend/services/WebSocketService.ts`: The real-time WebSocket system.
- `backend/middleware/authMiddleware.ts`: Authentication middleware for protecting routes.
- `backend/middleware/adminMiddleware.ts`: (To Be Implemented) Middleware for protecting admin-only routes.

### Frontend
- `frontend/src/router.tsx`: The secure, lazy-loaded frontend router.
- `frontend/src/pages/Login.tsx`: The user login component.
- `frontend/src/pages/Register.tsx`: The user registration component.

---

## 🏁 The Onboarding System
Handles the initial user journey and profile setup.

#### Backend
- `backend/config/onboarding.ts`: Defines role-based onboarding tracks.
- `backend/services/OnboardingService.ts`: Manages the onboarding lifecycle.
- `backend/controllers/onboardingController.ts`: Exposes onboarding logic via API.

#### Frontend
- `frontend/src/hooks/useOnboarding.ts`: Hook for managing onboarding state and API calls.
- `frontend/src/components/onboarding/Onboarding.tsx`: The UI for the onboarding checklist.

---

## 📝 The Seller Onboarding & Listings Management System
Allows sellers to create and manage vehicle listings.

#### Backend
- `backend/models/Listing.ts`: The Mongoose model for a vehicle listing.
- `backend/validation/ListingSchema.ts`: Zod schema for listing data.
- `backend/services/ListingService.ts`: Manages the business logic for listings.

#### Frontend
- `frontend/src/hooks/useListingForm.ts`: Hook for managing the listing creation form.
- `frontend/src/components/listings/ListingForm.tsx`: The UI for creating/editing a listing.

---

## 📸 The Unified Photo Management System
A platform-wide service for securely handling all image and video assets.

#### Backend
- `backend/models/Photo.ts`: The Mongoose model for tracking every photo asset.
- `backend/services/PhotoService.ts`: The core service using pre-signed URLs for secure cloud uploads.
- `backend/controllers/photoController.ts`: Exposes the photo service via API.
- `backend/routes/photoRoutes.ts`: Defines the API endpoints for photo management.

#### Frontend
- `frontend/src/hooks/usePhotoUploader.ts`: The unified, reusable hook for the entire upload process.
- `frontend/src/components/common/PhotoUploader.tsx`: The single, unified UI component for all photo uploads.

---

## ⚖️ The Reverse Auction & Service Marketplace
The core engine where sales and service bidding occurs.

#### Backend
- `backend/models/Auction.ts`: The model for all auction events (`SALE` and `SERVICES`).
- `backend/models/Bid.ts`: The model for all bids placed on auctions.
- `backend/models/Option.ts`: The model for the "Option-to-Purchase" feature.
- `backend/models/OptionBid.ts`: The model for bids placed on an Option.
- `backend/validation/AuctionSchema.ts`: Zod schemas for auction and bid data.
- `backend/validation/OptionSchema.ts`: Zod schemas for option bidding data.
- `backend/services/AuctionService.ts`: The primary engine for managing auction lifecycles.
- `backend/services/OptionService.ts`: The engine for the competitive option-bidding system.
- `backend/controllers/auctionController.ts`: The API controller for auctions.
- `backend/controllers/optionController.ts`: The API controller for options.
- `backend/routes/auctionRoutes.ts`: API endpoints for auctions.
- `backend/routes/optionRoutes.ts`: API endpoints for options.

---

## 📄 The Contracts & Documents System
Generates, manages, and secures all legal agreements.

#### Backend
- `backend/models/Contract.ts`: The Mongoose model for all legal documents.
- `backend/services/ContractService.ts`: Service for PDF generation and e-signature workflow.
- `backend/controllers/contractController.ts`: The API controller for contracts.
- `backend/routes/contractRoutes.ts`: API endpoints for contracts.

---

## 🛡️ The Disputes & Reviews System
Builds trust and safety through conflict resolution and transparent feedback.

#### Backend
- `backend/models/Dispute.ts`: The model for a dispute case.
- `backend/models/DisputeMessage.ts`: The model for messages within a dispute.
- `backend/models/Review.ts`: The model for user-submitted ratings and comments.
- `backend/validation/DisputeSchema.ts`: Zod schemas for dispute data.
- `backend/validation/ReviewSchema.ts`: Zod schema for review data.
- `backend/services/DisputeService.ts`: Manages the dispute resolution workflow.
- `backend/services/ReviewService.ts`: Manages review submission and aggregate ratings.
- `backend/controllers/disputeController.ts`: The API controller for disputes.
- `backend/controllers/reviewController.ts`: The API controller for reviews.
- `backend/routes/disputeRoutes.ts`: API endpoints for disputes.
- `backend/routes/reviewRoutes.ts`: API endpoints for reviews.

---

## 📜 The Title Management System
Ensures the legal and legitimate transfer of vehicle ownership.

#### Backend
- `backend/models/Title.ts`: The "digital twin" model for a vehicle's physical title.
- `backend/validation/TitleSchema.ts`: Zod schemas for title data.
- `backend/services/titleService.ts`: Service for managing verification and the agent workflow.
- `backend/controllers/titleController.ts`: The API controller for titles.
- `backend/routes/titleRoutes.ts`: API endpoints for titles.

---

## 🤝 The Insurance & Lender System
Onboards and provides tools for our key service provider partners.

#### Backend
- `backend/models/ServiceProviderProfile.ts`: The unified model for all provider types.
- `backend/validation/ServiceProviderSchema.ts`: Zod schemas for provider profile data.
- `backend/services/ServiceProviderService.ts`: The unified service for managing all providers.
- `backend/controllers/serviceProviderController.ts`: The API controller for providers.
- `backend/routes/serviceProviderRoutes.ts`: API endpoints for providers.

---

## 👑 The Admin User Management System
The command center for platform governance and moderation.

#### Backend
- `backend/validation/AdminSchema.ts`: Zod schemas for admin actions.
- `backend/services/AdminService.ts`: The definitive service for all admin-level business logic.
- `backend/controllers/adminController.ts`: The API controller for the admin panel.
- `backend/routes/adminRoutes.ts`: The secure, admin-only API endpoints.

#### Frontend
- `frontend/src/hooks/useAdminUsers.ts`: Hook for managing the user list in the admin panel.
- `frontend/src/pages/admin/AdminUserManagerPage.tsx`: The primary UI for user management.

---

## 💰 The Finalization & Auditing System
The capstone system for financial settlement and reporting.

#### Backend
- `backend/models/Transaction.ts`: The master record for the financial settlement of an auction.
- `backend/models/LedgerEntry.ts`: The immutable entry for the internal financial ledger.

---

## 📈 The Offers History System
Provides users with a clear history of their marketplace activity.

#### Backend
- `backend/services/HistoryService.ts`: Service for querying and aggregating user bid/offer history.
- `backend/controllers/historyController.ts`: The API controller for history.
- `backend/routes/historyRoutes.ts`: API endpoints for history.

---

## 🎮 The Social & Gamification System
Drives user engagement and rewards positive behavior.

#### Backend
- `backend/models/ActivityEvent.ts`: Logs significant user actions.
- `backend/models/Badge.ts`: Defines all available achievement badges.
- `backend/models/UserBadge.ts`: Records which user has earned which badge.
- `backend/config/gamification.config.ts`: Centralized rules for points and badges.
- `backend/services/GamificationService.ts`: The core engine for the gamification system.

---

## 💬 The Forum & Community System
A space for users to interact and build a community.

#### Backend
- `backend/models/ForumCategory.ts`: Defines the sections of the forum.
- `backend/models/ForumThread.ts`: A single forum topic/thread.
- `backend/models/ForumPost.ts`: A single reply within a thread.

The Next Horizon

With this complete blueprint documented, the architectural phase is now officially concluded. We have designed the dream.

The question is no longer what we build, but how we build it. As we move from architecture to implementation, our next major phase could be:

1. Full Backend Implementation: Focus exclusively on writing the production-ready backend code for all the services we've designed.

2. Full Frontend Implementation: Begin the sprint to build all the user interfaces that connect to our complete set of APIs.

3. Create a Vertical Slice: Choose one user journey (like the Seller's experience) and build it end-to-end (backend, frontend, and tests) to create a single, "shippable" feature first.