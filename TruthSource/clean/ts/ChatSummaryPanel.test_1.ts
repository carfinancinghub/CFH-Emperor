// Crown Certified Header
// CFH Automotive Ecosystem
// File: ChatSummaryPanel.tsx
// Path: frontend/src/components/chat/ChatSummaryPanel.tsx

import React from 'react';
import { ClipboardCopy, ChevronDown, ChevronUp } from 'lucide-react';

interface ChatSummaryPanelProps {
  summary: string;
  open: boolean;
  toggle: () => void;
}

const ChatSummaryPanel: React.FC<ChatSummaryPanelProps> = ({ summary, open, toggle }): JSX.Element => {
  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="p-3 border-b bg-gray-50">
      <div>
        <button
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:underline"
          onClick={toggle}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Summary of Dispute
        </button>
        {open && (
          <div className="text-sm text-gray-600 mt-1 max-w-3xl">
            {summary}
            <button
              onClick={copyToClipboard}
              className="ml-2 text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <ClipboardCopy size={12} /> Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSummaryPanel;

/** TODO */
// Suggestions:
// 1. Consider adding error handling for clipboard access in environments where it might not be supported.
// 2. Implement unit tests to ensure the component's behavior is as expected.
// 3. Evaluate the accessibility of the component, ensuring it meets WCAG standards.
