// app/(app)/chat/[id]/page.tsx
import React from 'react';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const conversationId = (await params).id;

  return (
    <div className="flex flex-col h-full bg-background rounded-l-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with ID: {conversationId}</h1>
      <div className="flex-1 overflow-y-auto border border-gray-300 p-4 rounded-md">
        {/* This is where chat messages will be displayed */}
        <p className="text-gray-500">Start your conversation!</p>
        <p className="text-gray-500">More messages will appear here...</p>
      </div>
      <div className="mt-4">
        {/* This is where the chat input will go */}
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">Send</button>
      </div>
    </div>
  );
}
