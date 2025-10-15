// @ai-generated via ai-orchestrator
This component has been converted to TypeScript (TSX). We have introduced specific interfaces to define the shape of the widget data and leveraged discriminated unions to allow TypeScript to correctly narrow the types inside the rendering logic.

### `AdminCustomWidgetLibrary.tsx`

```tsx
/**
 * File: AdminCustomWidgetLibrary.tsx
 * Path: frontend/src/components/admin/AdminCustomWidgetLibrary.tsx
 * Purpose: Customizable admin dashboard with drag-and-drop widgets for auction stats and user activity
 * Author: SG (05042219)
 * Date: May 04, 2025, 22:19
 * Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import PremiumFeature from '@components/common/PremiumFeature';
import logger from '@utils/logger';
import { toast } from 'sonner';
import { exportLenderInsightsToPdf } from '@utils/lenderExportUtils';

// --- Type Definitions ---

interface Position {
  x: number;
  y: number;
}

// Define individual widget structures using discriminated unions for type safety
interface AuctionStatsWidget {
  id: string;
  type: 'Auction Stats';
  data: { auctions: number };
  position: Position;
}

interface UserActivityWidget {
  id: string;
  type: 'User Activity';
  data: { activeUsers: number };
  position: Position;
}

interface FlaggedChatsWidget {
  id: string;
  type: 'Flagged Chats';
  data: { flaggedCount: number };
  position: Position;
}

interface DisputeVolumeWidget {
  id: string;
  type: 'Dispute Volume';
  data: { disputeCount: number };
  position: Position;
}

type Widget = AuctionStatsWidget | UserActivityWidget | FlaggedChatsWidget | DisputeVolumeWidget;

// --- Component ---

const AdminCustomWidgetLibrary: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define default widgets for fallback if API returns empty data
  const defaultWidgets: Widget[] = [
    { id: '1', type: 'Auction Stats', data: { auctions: 125 }, position: { x: 0, y: 0 } },
    { id: '2', type: 'User Activity', data: { activeUsers: 50 }, position: { x: 300, y: 0 } },
  ];

  // Fetch initial widget layouts
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await fetch('/api/admin/widgets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch widgets');
        
        // Assert the fetched data shape if available, otherwise use defaults
        const data: Widget[] = await response.json(); 
        setWidgets(data && data.length > 0 ? data : defaultWidgets);
      } catch (err) {
        // Ensure error is treated as Error object for safe logging
        const errorMessage = (err as Error).message;
        setError('Error fetching widgets');
        logger.error(`Error fetching widgets: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchWidgets();
  }, []);

  // Save widget layout
  const saveLayout = async (layout: Widget[]): Promise<void> => {
    try {
      const response = await fetch('/api/admin/widgets/save', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(layout),
      });
      if (!response.ok) throw new Error('Failed to save layout');
      toast.success('Layout saved successfully');
    } catch (err) {
      const errorMessage = (err as Error).message;
      logger.error(`Error saving layout: ${errorMessage}`);
      toast.error('Failed to save layout');
    }
  };

  // Handle drag-and-drop
  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) return;

    // NOTE: Standard react-beautiful-dnd DropResult does not contain x/y coordinates.
    // The original JS implies potential custom handling or assumptions about these properties.
    // We coerce to `any` locally to preserve original runtime behavior.
    const destination = result.destination as any; 

    const updatedWidgets = [...widgets];
    const [reorderedWidget] = updatedWidgets.splice(result.source.index, 1);
    
    updatedWidgets.splice(result.destination.index, 0, {
      ...reorderedWidget,
      position: { 
        // Preserve position if destination x/y are not provided (typical for list reorder)
        x: destination.x || reorderedWidget.position.x, 
        y: destination.y || reorderedWidget.position.y 
      },
    });
    setWidgets(updatedWidgets);
    saveLayout(updatedWidgets);
  };


  // Export layout as PDF (premium)
  const exportLayout = async (): Promise<void> => {
    try {
      const pdfUri = exportLenderInsightsToPdf(widgets, false);
      window.open(pdfUri, '_blank');
      toast.success('PDF exported successfully');
    } catch (err) {
      const errorMessage = (err as Error).message;
      logger.error(`Error exporting PDF: ${errorMessage}`);
      toast.error('Failed to export PDF');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <PremiumFeature feature="adminCustomWidgets">
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Custom Widget Library</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="widgets">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-3 gap-4">
                {widgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 rounded shadow"
                        // Explicitly set absolute position based on stored widget data
                        style={{ position: 'absolute', left: widget.position.x, top: widget.position.y }}
                      >
                        <h2 className="font-semibold">{widget.type}</h2>
                        {/* Type guards using widget.type enable safe property access (discriminated union) */}
                        {widget.type === 'Auction Stats' && <p>Auctions: {widget.data.auctions}</p>}
                        {widget.type === 'User Activity' && <p>Active Users: {widget.data.activeUsers}</p>}
                        
                        <PremiumFeature feature="adminCustomWidgets">
                          {widget.type === 'Flagged Chats' && <p>Flagged: {widget.data.flaggedCount}</p>}
                          {widget.type === 'Dispute Volume' && <p>Disputes: {widget.data.disputeCount}</p>}
                        </PremiumFeature>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <PremiumFeature feature="adminCustomWidgets">
          <button
            onClick={exportLayout}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            aria-label="Export layout as PDF"
          >
            Export Layout as PDF
          </button>
        </PremiumFeature>
      </div>
    </PremiumFeature>
  );
};

// Cod2 Crown Certified: This component provides a drag-and-drop widget library for admins,
// with free Auction Stats and User Activity widgets, premium Flagged Chats and Dispute Volume widgets,
// supports layout saving and PDF export, uses @ aliases, and ensures robust error handling.
export default AdminCustomWidgetLibrary;
```