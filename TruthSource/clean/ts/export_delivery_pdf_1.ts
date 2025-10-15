/*
 * File: exportDeliveryPDF.ts
 * Path: C:\CFH\frontend\src\utils\exportDeliveryPDF.ts
 * Purpose: Generate and export delivery details as a PDF document for the CFH Marketplace
 * Author: CFH Dev Team
 * Date: 2025-07-22T15:14:00.000Z
 * Batch ID: Marketplace-072225
 */
import jsPDF from 'jspdf';
import { analyticsApi } from '@/services/analyticsApi';

// Interface for delivery data structure
interface DeliveryData {
  deliveryId: string;
  haulerName: string;
  jobTitle: string;
  pickupLocation: string;
  dropoffLocation: string;
  deliveryDate: string;
  price: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

// Interface for PDF export options
interface PDFOptions {
  fileName?: string;
  title?: string;
  includeHeader?: boolean;
}

/**
 * Generates a PDF document containing delivery details and triggers download
 * @param deliveryId - The ID of the delivery to export
 * @param options - Optional configuration for PDF generation
 * @returns Promise<void>
 */
const exportDeliveryPDF = async (deliveryId: string, options: PDFOptions = {}): Promise<void> => {
  const { fileName = `delivery-${deliveryId}.pdf`, title = 'Delivery Details', includeHeader = true } = options;

  try {
    // Fetch delivery data from API
    const response = await analyticsApi.getDeliveryDetails(deliveryId);
    const deliveryData: DeliveryData = response.data;

    // Initialize jsPDF
    const doc = new jsPDF();
    
    // Add header if enabled
    if (includeHeader) {
      doc.setFontSize(18);
      doc.text(title, 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    }

    // Add delivery details
    doc.setFontSize(14);
    doc.text(`Delivery ID: ${deliveryData.deliveryId}`, 20, 50);
    doc.text(`Hauler: ${deliveryData.haulerName}`, 20, 60);
    doc.text(`Job Title: ${deliveryData.jobTitle}`, 20, 70);
    doc.text(`Pickup: ${deliveryData.pickupLocation}`, 20, 80);
    doc.text(`Dropoff: ${deliveryData.dropoffLocation}`, 20, 90);
    doc.text(`Date: ${deliveryData.deliveryDate}`, 20, 100);
    doc.text(`Price: $${deliveryData.price.toLocaleString()}`, 20, 110);
    doc.text(`Status: ${deliveryData.status}`, 20, 120);

    // Save the PDF
    doc.save(fileName);
  } catch (error) {
    console.error('Failed to generate delivery PDF:', error);
    throw new Error('Unable to generate PDF. Please try again.');
  }
};

// TODO: Future Improvements
// - Add support for custom PDF templates (e.g., branded headers/footers).
// - Implement error handling for specific API failure cases.
// - Add support for batch PDF generation for multiple deliveries.
// - Include additional delivery metadata (e.g., vehicle details, signatures).

export default exportDeliveryPDF;