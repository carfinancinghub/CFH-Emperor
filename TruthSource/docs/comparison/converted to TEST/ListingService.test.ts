// ----------------------------------------------------------------------
// File: ListingService.test.ts
// Path: backend/tests/services/ListingService.test.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 12:35 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the ListingService. These tests ensure the service's
// business logic, validation integration, and authorization checks work
// as expected.
//
// @architectural_notes
// - **Isolated Unit Tests**: This suite uses Jest's mocking capabilities to
//   completely isolate the ListingService. The database model (`Listing`) and
//   validation schema (`ListingSchema`) are mocked to ensure we are only
//   testing the service's logic, not its dependencies.
//
// @todos
// - @free:
//   - [ ] Add tests for other service functions (e.g., getListingsBySellerId, deleteListingById).
//   - [ ] Increase test coverage to include more edge cases for each function.
//
// ----------------------------------------------------------------------

import ListingService from '@/services/ListingService';
import Listing from '@/models/Listing';
import { ListingSchema } from '@/validation/ListingSchema';

// Mock the dependencies
jest.mock('@/models/Listing');
jest.mock('@/validation/ListingSchema');

const mockListingData = {
  vin: '12345678901234567',
  make: 'Test Make',
  model: 'Test Model',
  year: 2022,
  mileage: 10000,
  price: 25000,
  description: 'A great test vehicle.',
  photos: ['https://example.com/photo1.jpg'],
};

const mockUserId = 'mockUserId123';

describe('ListingService', () => {

  // Clear all mocks after each test to ensure a clean state
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Tests for createListing ---
  describe('createListing', () => {
    it('should throw an error if validation fails', async () => {
      const validationError = new Error('Validation failed');
      // Arrange: Make the mocked schema throw an error when parse is called
      (ListingSchema.parse as jest.Mock).mockImplementation(() => {
        throw validationError;
      });

      // Act & Assert: Expect the service to reject with the validation error
      await expect(ListingService.createListing(mockUserId, {})).rejects.toThrow(validationError);
    });

    it('should create and save a new listing with valid data', async () => {
      // Arrange: Make the mocked schema return the valid data
      (ListingSchema.parse as jest.Mock).mockReturnValue(mockListingData);
      const saveMock = jest.fn().mockResolvedValue(true);
      (Listing as jest.Mock).mockImplementation(() => ({ save: saveMock }));

      // Act: Call the service function
      await ListingService.createListing(mockUserId, mockListingData);

      // Assert: Check that validation was called and a new listing was saved
      expect(ListingSchema.parse).toHaveBeenCalledWith(mockListingData);
      expect(Listing).toHaveBeenCalledWith({
        ...mockListingData,
        seller: mockUserId,
        status: 'draft',
      });
      expect(saveMock).toHaveBeenCalled();
    });
  });

  // --- Tests for updateListing ---
  describe('updateListing', () => {
    it('should throw an error if validation fails on update', async () => {
        const validationError = new Error('Update validation failed');
        (ListingSchema.partial().parse as jest.Mock).mockImplementation(() => {
            throw validationError;
        });
        
        await expect(ListingService.updateListing('listingId', mockUserId, {})).rejects.toThrow(validationError);
    });

    it('should update a listing with valid data', async () => {
        const updateData = { price: 26000 };
        (ListingSchema.partial().parse as jest.Mock).mockReturnValue(updateData);
        (Listing.findOneAndUpdate as jest.Mock).mockResolvedValue({ ...mockListingData, ...updateData });

        await ListingService.updateListing('listingId', mockUserId, updateData);

        expect(Listing.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'listingId', seller: mockUserId },
            { $set: updateData },
            { new: true }
        );
    });

    it('should throw an error if listing to update is not found', async () => {
        const updateData = { price: 26000 };
        (ListingSchema.partial().parse as jest.Mock).mockReturnValue(updateData);
        // Arrange: Make the database call return null
        (Listing.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

        // Act & Assert
        await expect(ListingService.updateListing('listingId', mockUserId, updateData)).rejects.toThrow('Listing not found or user not authorized to update.');
    });
  });
});