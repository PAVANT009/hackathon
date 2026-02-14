// app/(app)/chat/[id]/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import ChatThread from '@/modules/chat/ui/components/chat-thread';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const conversationId = id;

  const conversationData = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
      booking: true,
    },
  });

  if (!conversationData) {
    return (
      <div className="flex flex-col h-full bg-background rounded-l-2xl p-4 items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Conversation Not Found</h1>
        <p className="text-gray-500">Please check the URL.</p>
      </div>
    );
  }

  const booking =
    conversationData.booking ??
    (await prisma.booking.create({
      data: {
        conversationId: conversationData.id,
        userId: conversationData.userId,
      },
    }));

  const messages = conversationData.messages.map((msg) => ({
    id: msg.id,
    sender: msg.sender,
    messageText: msg.messageText,
    createdAt: msg.createdAt.toISOString(),
  }));

  return (
    <div className="h-full w-full bg-background rounded-l-2xl">
      <h1 className="px-4 pt-4 text-2xl font-bold">
        Chat with: {booking?.serviceType ?? "Booking"}
      </h1>
      <ChatThread
        status= {conversationData.status}
        conversationId={conversationData.id}
        bookingId={booking?.id ?? null}
        initialBooking={
          booking
            ? {
                id: booking.id,
                serviceType: booking.serviceType,
                address: booking.address,
                description: booking.description,
                urgencyLevel: booking.urgencyLevel,
                bookingStatus: booking.bookingStatus,
              }
            : null
        }
        initialMessages={messages}
      />
    </div>
  );
}
