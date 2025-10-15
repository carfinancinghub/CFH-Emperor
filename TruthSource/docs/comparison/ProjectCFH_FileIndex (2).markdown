# Project CFH File Index

This document lists all files for Project CFH, organized by vertical slice, including their names, paths, versions, and artifact IDs. It serves as a reference to ensure all files are saved correctly in their designated folders for development and deployment. Files are grouped by the four completed vertical slices: Seller’s Listing Creation, Auction Viewing & Bidding, Admin User Management, and Finalization & Auditing, plus supporting files.

## 1. Seller’s Listing Creation Slice
**Status**: Complete (backend, frontend, tests implemented).
**Purpose**: Enables sellers to create and manage vehicle listings, including photo uploads.
**Files**:
| File Name | Path | Version | Artifact ID | Artifact Version ID |
|-----------|------|---------|-------------|---------------------|
| ListingService.ts | backend/services/ListingService.ts | 2.2.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | fd264c8f-2420-4926-a29f-a6540cd7dd5a |
| PhotoService.ts | backend/services/PhotoService.ts | 2.1.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 9e6a572c-01bf-410d-92a8-642a8ab9e447 |
| HistoryService.ts | backend/services/HistoryService.ts | 1.1.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | d84fbb7c-f1cb-42ab-b880-74157f72bf9b |
| ActionLog.ts | backend/models/ActionLog.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 7ca1fecc-71ab-405f-ab5c-b201d3d953c4 |
| Listing.ts | backend/src/models/Listing.ts | 2.0.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 8c518141-5c49-456a-b0e1-0f0b71eb2844 |
| ListingSchema.ts | backend/validation/ListingSchema.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 9ab854e7-d662-4ade-830e-93a9a70c6075 |
| useListingForm.ts | frontend/src/hooks/useListingForm.ts | 2.0.3 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 9ddaf199-3903-4849-b7f2-d365d00e0714 |
| ListingForm.tsx | frontend/src/components/listings/ListingForm.tsx | 2.1.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 86a67d4f-d3f5-469c-9fb0-e9887673f862 |
| useListingForm.test.ts | frontend/src/tests/hooks/useListingForm.test.ts | 1.0.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 6d1a244d-67a8-47fe-a04d-6d34b760d7e0 |
| sellerFlow.spec.ts | cypress/integration/sellerFlow.spec.ts | 1.0.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 933f2291-3ef3-4fa3-a70b-63d63e416b7d |

## 2. Auction Viewing & Bidding Slice
**Status**: Complete (backend, frontend, tests implemented).
**Purpose**: Enables buyers to view active auctions, see details, and place bids.
**Files**:
| File Name | Path | Version | Artifact ID | Artifact Version ID |
|-----------|------|---------|-------------|---------------------|
| AuctionService.ts | backend/services/AuctionService.ts | 1.2.2 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | cc6c81fc-06e2-48a4-8b63-3ec05b726126 |
| auctionController.ts | backend/controllers/auctionController.ts | 1.2.2 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | ead09218-d2f9-45e3-897f-baa1e1db9255 |
| auctionRoutes.ts | backend/routes/auctionRoutes.ts | 1.2.2 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | ac817f2b-a186-4c6d-a607-5fb8c6a406c1 |
| Auction.ts | backend/models/Auction.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 977bfa28-18ea-477f-ba73-cf849cd84252 |
| AuctionSchema.ts | backend/validation/AuctionSchema.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | ac92c37b-5bd2-489f-81f4-d0867705ea1f |
| Bid.ts | backend/models/Bid.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 17665f0b-d1b1-43f9-b185-f46f6f20ab18 |
| PlaceBidSchema.ts | backend/validation/PlaceBidSchema.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | c0506002-cc1c-4197-800c-b7a3ad269361 |
| useAuctions.ts | frontend/src/hooks/useAuctions.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 7e022c3c-f85a-411f-9da7-244eef59d511 |
| AuctionListPage.tsx | frontend/src/pages/AuctionListPage.tsx | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 55330600-02ec-4ae2-aee3-640dd8c5e198 |
| useAuctionDetails.ts | frontend/src/hooks/useAuctionDetails.ts | 1.0.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | be2b85ce-b78e-4d6c-8423-288365c3adbe |
| AuctionDetailPage.tsx | frontend/src/pages/AuctionDetailPage.tsx | 1.0.3 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 5f5b7e3b-1a2b-4e5c-a4f3-9c6e8d7a2b1e |
| useAuctionDetails.test.ts | frontend/src/tests/hooks/useAuctionDetails.test.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | e0b8a5e2-c177-4820-a9b5-fc645700123e |
| AuctionService.test.ts | backend/tests/AuctionService.test.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | a848b955-408c-434d-8999-59086481a2cf |
| buyerFlow.spec.ts | cypress/integration/buyerFlow.spec.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 2572aacd-b6f0-4a1f-bb8a-a8fd4d1eae46 |

## 3. Admin User Management Slice
**Status**: Complete (backend, frontend, tests implemented).
**Purpose**: Enables admins to manage users and service providers.
**Files**:
| File Name | Path | Version | Artifact ID | Artifact Version ID |
|-----------|------|---------|-------------|---------------------|
| AdminService.ts | backend/services/AdminService.ts | 2.1.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | bb4cfe7e-58c1-47a6-8894-cb917258ca39 |
| User.ts | backend/models/User.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 10f4841f-9574-4a5b-9a13-6294f02c08b9 |
| ServiceProviderProfile.ts | backend/models/ServiceProviderProfile.ts | 1.0.3 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 159d27c5-a633-4538-bb79-99c050dd504a |
| adminMiddleware.ts | backend/middleware/adminMiddleware.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 1bb5f53d-8b50-48d0-99e5-1f3dab18ecf8 |
| UserService.ts | backend/services/UserService.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 17223e2e-8621-4110-bd33-19426a86aa70 |
| useAdminUsers.ts | frontend/src/hooks/useAdminUsers.ts | 2.0.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | b3128e90-f310-4865-9515-347ee46d8b15 |
| AdminUserManagerPage.tsx | frontend/src/pages/admin/AdminUserManagerPage.tsx | 2.0.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 935c6d12-ec0b-4dd7-b935-dad8913a75f7 |
| AdminService.test.ts | backend/tests/AdminService.test.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | f0ddfcaf-1c42-4e4d-8b3f-42a0cf00c0d3 |
| adminFlow.spec.ts | cypress/integration/adminFlow.spec.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | faa2be35-1ada-43b8-8b5e-8dbf72cbac0d |

## 4. Finalization & Auditing System Slice
**Status**: Complete (backend, frontend, tests implemented).
**Purpose**: Finalizes auctions and creates auditable financial records.
**Files**:
| File Name | Path | Version | Artifact ID | Artifact Version ID |
|-----------|------|---------|-------------|---------------------|
| TransactionService.ts | backend/services/TransactionService.ts | 1.0.2 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 305603ec-8d70-4a48-b6c5-e555e9356796 |
| Transaction.ts | backend/models/Transaction.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | c518f7eb-6b68-43ed-b33e-de96301d4b3f |
| LedgerEntry.ts | backend/models/LedgerEntry.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | bb420304-0523-4597-b7c6-78bbafcd8725 |
| transactionController.ts | backend/controllers/transactionController.ts | 1.0.2 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 6b08a403-40d5-4b0d-879c-2961aebe4e8d |
| transactionRoutes.ts | backend/routes/transactionRoutes.ts | 1.0.2 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | f6331b70-f582-424c-8429-24217adcd5c5 |
| auth.ts | backend/utils/auth.ts | 1.0.2 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 2e5f8b3c-4d3e-4f9d-c1e6-b0a9d8c7f5b4 |
| PaymentProcessor.ts | backend/services/PaymentProcessor.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | b7fc347e-7b6a-4a5b-ba96-8e29b9b6cda8 |
| useTransactions.ts | frontend/src/hooks/useTransactions.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 86aff1c0-2e01-46a7-a400-a68598a6b7d5 |
| TransactionReportPage.tsx | frontend/src/pages/TransactionReportPage.tsx | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | bdf0f728-82a8-4f92-97af-5c1c8410c1be |
| useTransactionDetails.ts | frontend/src/hooks/useTransactionDetails.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | eb8f97a5-ff61-46e7-92cc-17b4d4fcc391 |
| TransactionDetailPage.tsx | frontend/src/pages/TransactionDetailPage.tsx | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 9ec8278f-d099-42c9-8021-515a3218ab7c |
| TransactionService.test.ts | backend/tests/TransactionService.test.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | db2d2ded-d1ea-4af1-ab14-9242bbdcf2df |
| finalizationFlow.spec.ts | cypress/integration/finalizationFlow.spec.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | bc9992d0-934b-46c1-acb6-f373d2191252 |

## 5. Supporting Files
**Status**: Complete (infrastructure and testing utilities).
**Purpose**: Supports deployment and testing across slices.
**Files**:
| File Name | Path | Version | Artifact ID | Artifact Version ID |
|-----------|------|---------|-------------|---------------------|
| docker-compose.yml | docker-compose.yml | 1.0.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | bc93ac9e-54d5-4eeb-b9bd-d745d01fee39 |
| ci.yml | .github/workflows/ci.yml | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | a856e41d-1f76-43bd-8a72-288cff0d00d0 |
| commands.ts | cypress/support/commands.ts | 1.0.0 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 9d4e7a2b-3c2f-4e8c-b0d5-a9f8c7b6e4a3 |
| authFlow.spec.ts | cypress/integration/authFlow.spec.ts | 1.0.1 | fcce11f1-8dfd-44be-8cc3-da617b52d714 | 7a3d8f9c-2c1e-4f7b-a9c4-8e7f6b5a3d2f |

## Additional Notes
- **Dependencies**: All dependencies are resolved, with `auth.ts` now fully implemented.
- **Verification**: Save the updated files (`AuctionDetailPage.tsx` 1.0.3, `authFlow.spec.ts` 1.0.1, `auth.ts` 1.0.2, `commands.ts` 1.0.0) in their specified paths.
- **Next Steps**: Proceed with Mini’s suggestion to create a `.env.example` file and enhance the CI/CD pipeline with deployment steps.