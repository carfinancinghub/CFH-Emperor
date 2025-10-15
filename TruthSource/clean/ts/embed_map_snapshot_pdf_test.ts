// File: embedMapSnapshotPDF.test.ts
// Path: C:\CFH\frontend\src\utils\__tests__\embedMapSnapshotPDF.test.ts
// Author: CFH Dev Team
// Purpose: Unit tests for embedMapSnapshotPDF utility in the CFH Marketplace
// Date: 2025-07-22T20:25:00.000Z
// Batch ID: Marketplace-072225

import { embedMapSnapshotPDF } from '@utils/embedMapSnapshotPDF';
import { analyticsApi } from '@services/analyticsApi';
import { useTranslation } from '@i18n';
import jsPDF from 'jspdf';
import puppeteer from 'puppeteer';

// Mock dependencies
jest.mock('jspdf');
jest.mock('puppeteer');
jest.mock('@services/analyticsApi');
jest.mock('@i18n');

const mockedJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;
const mockedAnalyticsApi = analyticsApi as jest.Mocked<typeof analyticsApi>;
const mockedUseTranslation = useTranslation as jest.Mock;

describe('embedMapSnapshotPDF', () => {
  const mockT = jest.fn((key: string) => key);
  const mapData = {
    routeId: 'route-123',
    startLocation: '123 Main St',
    endLocation: '456 Oak Ave',
    lat: 40.7128,
    lng: -74.0060,
    zoom: 12,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseTranslation.mockReturnValue({ t: mockT });
  });

  it('should generate a PDF with map snapshot for Wow++ tier', async () => {
    mockedAnalyticsApi.getRouteData.mockResolvedValue({ data: mapData });
    const browserMock = { newPage: jest.fn(), close: jest.fn() };
    const pageMock = { goto: jest.fn(), screenshot: jest.fn().mockResolvedValue(Buffer.from('snapshot')) };
    mockedPuppeteer.launch.mockResolvedValue(browserMock as any);
    browserMock.newPage.mockResolvedValue(pageMock as any);
    const docMock = {
      setFontSize: jest.fn(),
      text: jest.fn(),
      image: jest.fn(),
      save: jest.fn(),
    };
    mockedJsPDF.mockReturnValue(docMock as any);

    const result = await embedMapSnapshotPDF('route-123', 'Wow++', { fileName: 'test.pdf', title: 'Test Map PDF' });

    expect(mockedAnalyticsApi.getRouteData).toHaveBeenCalledWith('route-123');
    expect(mockedPuppeteer.launch).toHaveBeenCalled();
    expect(pageMock.goto).toHaveBeenCalledWith(expect.stringContaining('lat=40.7128&lng=-74.0060&zoom=12'));
    expect(docMock.image).toHaveBeenCalledWith(expect.any(Buffer), { fit: [500, 400] });
    expect(docMock.save).toHaveBeenCalledWith('test.pdf');
    expect(result).toBe('route-123');
  });

  it('should throw error for non-Wow++ tiers', async () => {
    await expect(embedMapSnapshotPDF('route-123', 'Premium')).rejects.toThrow(
      'embedMapSnapshotPDF.error.noPermission'
    );
  });

  it('should handle API errors', async () => {
    mockedAnalyticsApi.getRouteData.mockRejectedValue(new Error('API Error'));

    await expect(embedMapSnapshotPDF('route-123', 'Wow++')).rejects.toThrow(
      'embedMapSnapshotPDF.error.generateFailed'
    );
  });

  // === TODOs and Suggestions ===
  // - Add tests for custom map styles (PURCHASE-789).
  // - Test error handling for invalid map coordinates.
  // - Mock Puppeteer screenshot failures.
  // - Test PDF generation with large snapshots.
});