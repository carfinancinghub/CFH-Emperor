/*
 * File: exportDeliveryPDF.test.ts
 * Path: C:\CFH\frontend\src\utils\__tests__\exportDeliveryPDF.test.ts
 * Purpose: Unit tests for exportDeliveryPDF utility function in the CFH Marketplace
 * Author: CFH Dev Team
 * Date: 2025-07-22T15:14:00.000Z
 * Batch ID: Marketplace-072225
 */
import { exportDeliveryPDF } from '@/utils/exportDeliveryPDF';
import { analyticsApi } from '@/services/analyticsApi';
import jsPDF from 'jspdf';

// Mock jsPDF and analyticsApi
jest.mock('jspdf');
jest.mock('@/services/analyticsApi');

const mockedJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
const mockedAnalyticsApi = analyticsApi as jest.Mocked<typeof analyticsApi>;

describe('exportDeliveryPDF', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate and save a PDF with delivery details', async () => {
    // Mock API response
    const deliveryData = {
      deliveryId: '123',
      haulerName: 'Fast Haulers',
      jobTitle: 'Vehicle Transport',
      pickupLocation: '123 Main St',
      dropoffLocation: '456 Oak Ave',
      deliveryDate: '2025-07-20',
      price: 1500,
      status: 'Completed',
    };
    mockedAnalyticsApi.getDeliveryDetails.mockResolvedValue({ data: deliveryData });

    // Mock jsPDF instance
    const docMock = {
      setFontSize: jest.fn(),
      text: jest.fn(),
      save: jest.fn(),
    };
    mockedJsPDF.mockReturnValue(docMock as any);

    // Call the function
    await exportDeliveryPDF('123', { fileName: 'test-delivery.pdf', title: 'Test Delivery' });

    // Verify API call
    expect(mockedAnalyticsApi.getDeliveryDetails).toHaveBeenCalledWith('123');

    // Verify PDF generation
    expect(docMock.setFontSize).toHaveBeenCalledWith(18);
    expect(docMock.text).toHaveBeenCalledWith('Test Delivery', 20, 20);
    expect(docMock.save).toHaveBeenCalledWith('test-delivery.pdf');
  });

  it('should throw an error if API call fails', async () => {
    mockedAnalyticsApi.getDeliveryDetails.mockRejectedValue(new Error('API Error'));

    await expect(exportDeliveryPDF('123')).rejects.toThrow('Unable to generate PDF. Please try again.');
  });

  // TODO: Future Test Improvements
  // - Test custom PDF templates with different header/footer configurations.
  // - Add tests for batch PDF generation.
  // - Test edge cases for invalid delivery IDs or missing data fields.
});