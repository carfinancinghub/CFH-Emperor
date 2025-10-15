// ----------------------------------------------------------------------
// File: MessagingInbox.tsx
// Path: frontend/src/pages/MessagingInbox.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:24 PDT
// Version: 1.0.1 (Fixed CurrentUser Reference)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Main inbox page with a two-pane layout for messaging.
// ----------------------------------------------------------------------
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import ConversationView from '@/components/messaging/ConversationView';

const MessagingInbox = () => {
  const { conversations, isLoading, error } = useConversations();
  const { conversationId: activeId } = useParams<{ conversationId: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(activeId || null);
  const { user } = useAuth();

  if (isLoading) return <div>Loading conversations...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto h-[calc(100vh-80px)] flex border rounded-lg">
      <div className="w-1/3 border-r overflow-y-auto">
        {conversations.map((convo: any) => (
          <div 
            key={convo._id} 
            onClick={() => setSelectedId(convo._id)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedId === convo._id ? 'bg-gray-200' : ''}`}
          >
            <p className="font-bold">{convo.listing.year} {convo.listing.make} {convo.listing.model}</p>
            <p className="text-sm text-gray-600">With: {convo.participants.find((p: any) => p._id !== user?.id).name}</p>
          </div>
        ))}
      </div>
      <div className="w-2/3">
        <ConversationView conversationId={selectedId} />
      </div>
    </div>
  );
};

export default MessagingInbox;