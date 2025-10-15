----------------------------------------------------------------------
File: search-plan.md
Path: docs/search-plan.md
Author: Gemini & SG Man, System Architects
Created: August 15, 2025 at 09:26 PDT
Version: 1.0.0
👑 Cod1 Crown Certified
----------------------------------------------------------------------

@description
Formal plan for the advanced search and filtering system. This feature will enhance the user experience by allowing buyers to efficiently find relevant vehicle auctions.

@architectural_notes
- **Performant**: Backend queries will be optimized using database indexes on filtered fields (`listing.make`, `listing.year`, etc.).
- **Dynamic Frontend**: The UI will update search results in real-time as filters are applied, using a debounced input to prevent excessive API calls.
- **Validated**: All backend query parameters will be strictly validated using Zod to ensure data integrity and prevent errors.
- **Auditable**: Every filtered search action will be logged to `HistoryService` for analytics.

@todos
- @free:
- [x] Define API query parameters.
- [x] Design the filter UI component.
- [x] Set performance metrics.
- @premium:
- [ ] ✨ Add the ability to save filter presets.
- @wow:
- [ ] 🚀 Implement a "recommended for you" sort option using machine learning.

----------------------------------------------------------------------
### 1. API Modifications

The `GET /api/v1/auctions` endpoint will be enhanced to accept the following optional query parameters:

- `make`: `string` - Filter by vehicle make (case-insensitive).
- `model`: `string` - Filter by vehicle model (case-insensitive).
- `yearMin`: `number` - The minimum vehicle year.
- `yearMax`: `number` - The maximum vehicle year.
- `maxPrice`: `number` - The maximum current bid or asking price.

### 2. Backend Logic

- **`AuctionService.ts`**: The `getActiveAuctions` method will be updated to dynamically construct a MongoDB query object based on the provided parameters.
- **Zod Schema**: A Zod schema will validate and coerce all incoming query parameters.
- **Database**: Ensure MongoDB has a compound index on `{ "listing.make": 1, "listing.year": 1, "listing.price": 1 }` to support efficient queries.

### 3. Frontend Implementation

- **`AuctionListPage.tsx`**: The page layout will be updated to a two-column grid, accommodating a new `FilterSidebar` component.
- **`FilterSidebar.tsx`**: A new component containing a form with inputs for make, model, year range (min/max), and a slider or input for max price.
- **`useAuctions.ts`**: This hook will be updated to:
  - Hold the current filter state.
  - Expose a function to update the filters.
  - Re-fetch auction data automatically when the filter state changes.
  - Serialize the filter state into query parameters for the API call.

### 4. Performance Metrics

- **Target Response Time**: The backend API (`GET /api/v1/auctions`) should respond to a filtered request in **under 500ms** on average.
- **Frontend Update Speed**: The auction list on the frontend should visually update within **100ms** after receiving the API response.