// ----------------------------------------------------------------------
// File: ConversationView.tsx
// Path: frontend/src/components/messaging/ConversationView.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:23 PDT
// Version: 1.0.1 (Added Input Validation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Component to display and interact with a single conversation.
// ----------------------------------------------------------------------
import React, { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';

const ConversationView = ({ conversationId }: { conversationId: string | null }) => {
  const { messages, isLoading, error, sendMessage } = useMessages(conversationId);
  const [content, setContent] = useState('');
  const { user } = useAuth();

  if (!conversationId) {
    return <div className="flex items-center justify-center h-full text-gray-500">Select a conversation to start messaging.</div>;
  }
  
  if (isLoading) return <div>Loading messages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && content.length <= 1000) {
      sendMessage(content);
      setContent('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg: any) => (
          <div key={msg._id} className={`flex ${msg.sender._id === user?.id ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.sender._id === user?.id ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 1000))}
          placeholder="Type a message..."
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
};

export default ConversationView;