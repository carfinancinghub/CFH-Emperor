// @ai-generated via ai-orchestrator
This conversion utilizes modern TypeScript features, adds detailed interface definitions for clarity and type safety, and maintains the exact behavioral output of the original JavaScript, including the somewhat unconventional access pattern (`data.userId`) within `exportAuctionData` by using type assertions (`as any`).

```tsx
// File: auctionExportUtils.tsx
// Path: C:\CFH\frontend\src\utils\auction\auctionExportUtils.tsx
// Purpose: Utility for exporting auction data in PDF, CSV, and JSON formats with validation, filtering, and premium features

// --- Type Definitions for External Modules (Mocks) ---
// Assuming these libraries have type declarations available
import jsPDF from 'jspdf';
import Papa from 'papaparse';

// Mock external utilities (replace these with actual utility imports if they have defined types)
// We assume logger and cacheManager have simple necessary methods.
interface Logger {
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
}
interface CacheManager {
    set(key: string, value: any, options: { ttl: number }): void;
}

// Type assertions for imported utilities (assuming they are correctly typed elsewhere)
import logger from '@utils/logger' as Logger;
import { cacheManager } from '@utils/cacheManager' as CacheManager;


// --- Core Data Interfaces ---

type AuctionStatus = 'open' | 'closed' | 'pending' | string;

/** Defines the structure of an auction item, including required fields. */
interface AuctionItem {
    id: string | number;
    title: string;
    status: AuctionStatus;
    [key: string]: any; // Allows for dynamic access to other data fields
}

/** Defines the standard return structure for successful export operations. */
interface ExportResult {
    success: boolean;
    fileName: string;
}

/** Defines the options object passed to the main export function. */
interface ExportOptions {
    data: AuctionItem[];
    format?: 'pdf' | 'csv' | 'json' | string;
    selectedColumns?: string[];
    filters?: Record<string, any>;
    isPremium?: boolean;
    template?: Record<string, string> | null; // Mapping of new column name to old data key
    onProgress?: (progress: { total: number; processed: number }) => void;
}


// --- Utility Functions ---

/**
 * Validates auction data before export.
 * @param data Array of auction items.
 * @param selectedColumns Optional array of columns expected in the data.
 * @returns true if valid, otherwise throws an error.
 */
const validateExportData = (data: AuctionItem[], selectedColumns?: string[]): true => {
    if (!Array.isArray(data) || data.length === 0) {
        logger.error('Invalid auction data: Empty or not an array');
        throw new Error('No auction data provided for export');
    }

    const firstItem = data[0];
    const requiredFields: Array<keyof AuctionItem> = ['id', 'title', 'status'];
    const missingFields = requiredFields.filter(field => !Object.prototype.hasOwnProperty.call(firstItem, field));
    
    if (missingFields.length > 0) {
        logger.error(`Missing required fields: ${missingFields.join(', ')}`);
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
    }

    if (selectedColumns && selectedColumns.length > 0) {
        const availableKeys = Object.keys(firstItem);
        if (!selectedColumns.every(col => availableKeys.includes(col))) {
            logger.error('Invalid column selection for export');
            throw new Error('Selected columns not found in data');
        }
    }

    return true;
};

/**
 * Throttles function calls to prevent excessive executions (e.g., UI freezing during rapid clicks).
 * @param fn The function to throttle.
 * @param limit The time limit (in ms) between successful calls.
 * @returns A throttled function.
 */
const throttleExport = <T extends any[]>(
    fn: (...args: T) => ExportResult, 
    limit: number = 1000
): ((...args: T) => ExportResult | void) => {
    let lastCall = 0;
    
    return (...args: T): ExportResult | void => {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            return fn(...args);
        }
        logger.warn('Export throttled to prevent UI freeze');
        // Original JS throws an Error when throttled
        throw new Error('Export in progress, please wait');
    };
};

/**
 * Exports filtered and selected data to PDF format.
 */
const exportToPDF = (
    data: AuctionItem[], 
    selectedColumns: string[] = [], 
    isPremium: boolean = false
): ExportResult => {
    try {
        validateExportData(data, selectedColumns);
        
        // jsPDF initialization is safe based on the original JS structure
        const doc = new jsPDF();
        let yOffset = 10;

        doc.text('Auction Data Export', 10, yOffset);
        yOffset += 10;

        const columns = selectedColumns.length > 0 ? selectedColumns : Object.keys(data[0]);
        
        data.forEach((item) => {
            columns.forEach(col => {
                const value = item[col] || 'N/A';
                doc.text(`${col}: ${value}`, 10, yOffset);
                yOffset += 10;
            });
            if (isPremium) {
                doc.text(`Generated by Premium User`, 10, yOffset);
                yOffset += 10;
            }
            yOffset += 5;
        });

        const fileName = `auction_export_${Date.now()}.pdf`;
        doc.save(fileName);
        
        logger.info(`PDF export successful: ${fileName}`);
        return { success: true, fileName };
    } catch (err: any) {
        logger.error(`PDF export failed: ${err.message}`);
        // Re-throw standardized error message
        throw new Error(`Failed to export PDF: ${err.message}`);
    }
};

/**
 * Exports filtered and selected data to CSV format using PapaParse.
 */
const exportToCSV = (data: AuctionItem[], selectedColumns: string[] = []): ExportResult => {
    try {
        validateExportData(data, selectedColumns);
        
        const columns = selectedColumns.length > 0 ? selectedColumns : Object.keys(data[0]);
        
        const csvData = data.map(item => {
            const row: Record<string, any> = {};
            columns.forEach(col => {
                // Ensure all selected columns are present
                row[col] = item[col] || '';
            });
            return row;
        });

        const csv = Papa.unparse(csvData);
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `auction_export_${Date.now()}.csv`;
        a.click();
        
        URL.revokeObjectURL(url);

        logger.info(`CSV export successful: ${a.download}`);
        return { success: true, fileName: a.download };
    } catch (err: any) {
        logger.error(`CSV export failed: ${err.message}`);
        throw new Error(`Failed to export CSV: ${err.message}`);
    }
};

/**
 * Exports filtered and selected data to JSON format.
 */
const exportToJSON = (data: AuctionItem[], selectedColumns: string[] = []): ExportResult => {
    try {
        validateExportData(data, selectedColumns);
        
        const columns = selectedColumns.length > 0 ? selectedColumns : Object.keys(data[0]);
        
        const jsonData = data.map(item => {
            const row: Record<string, any> = {};
            columns.forEach(col => {
                row[col] = item[col] || null;
            });
            return row;
        });

        const json = JSON.stringify(jsonData, null, 2);
        
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `auction_export_${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);

        logger.info(`JSON export successful: ${a.download}`);
        return { success: true, fileName: a.download };
    } catch (err: any) {
        logger.error(`JSON export failed: ${err.message}`);
        throw new Error(`Failed to export JSON: ${err.message}`);
    }
};

/**
 * Main function for handling auction data export, wrapped in a throttle.
 */
const exportAuctionData = throttleExport((options: ExportOptions): ExportResult => {
    const {
        data,
        format = 'csv',
        selectedColumns = [],
        filters = {},
        isPremium = false,
        template = null,
        onProgress = null,
    } = options;

    try {
        let filteredData = data;
        
        // 1. Apply filters
        if (Object.keys(filters).length > 0) {
            filteredData = data.filter(item => {
                return Object.entries(filters).every(([key, value]) => item[key] === value);
            });
        }

        // 2. Apply template for premium users
        if (isPremium && template) {
            filteredData = filteredData.map(item => {
                const templatedItem: Record<string, any> = {};
                Object.keys(template).forEach(key => {
                    // key is the new column name, template[key] is the source data key
                    const sourceKey = template[key];
                    templatedItem[key] = item[sourceKey] || null;
                });
                return templatedItem as AuctionItem;
            });
        }

        // 3. Progress indicator for large datasets
        if (filteredData.length > 1000 && onProgress) {
            onProgress({ total: filteredData.length, processed: 0 });
            // Simulate processing steps for progress updates
            filteredData.forEach((_, index) => {
                if (index % 100 === 0) {
                    onProgress({ total: filteredData.length, processed: index });
                }
            });
        }

        // 4. Save user preferences (Handling potential JS bug/untyped access)
        // NOTE: The original JS accesses `data.userId`. Since 'data' is typed as an array, 
        // we use a type assertion (`as any`) here to preserve this runtime behavior 
        // which might rely on `data` being an extended array object.
        const userId = (data as any).userId || 'guest';
        if (isPremium) {
            cacheManager.set(`export_prefs_${userId}`, { format, selectedColumns }, { ttl: 86400 });
        }

        // 5. Execute export based on format
        switch (format.toLowerCase()) {
            case 'pdf':
                return exportToPDF(filteredData, selectedColumns, isPremium);
            case 'csv':
                return exportToCSV(filteredData, selectedColumns);
            case 'json':
                return exportToJSON(filteredData, selectedColumns);
            default:
                logger.error(`Unsupported export format: ${format}`);
                throw new Error(`Unsupported format: ${format}`);
        }
    } catch (err: any) {
        logger.error(`Export failed: ${err.message}`);
        throw err;
    }
});

export { exportAuctionData, validateExportData };
```