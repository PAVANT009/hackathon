import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus, ConversationStatus } from "@/src/generated/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, serviceType, address, description, urgencyLevel } = body ?? {};

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true, conversationId: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        serviceType: serviceType ?? undefined,
        address: address ?? undefined,
        description: description ?? undefined,
        urgencyLevel: urgencyLevel ?? undefined,
        bookingStatus: BookingStatus.CONFIRMED,
      },
      select: {
        id: true,
        serviceType: true,
        address: true,
        description: true,
        urgencyLevel: true,
        bookingStatus: true,
      },
    });

    await prisma.conversation.update({
      where: { id: booking.conversationId },
      data: {
        status: ConversationStatus.COMPLETED,
        detectedArea: updated.address ?? undefined,
        detectedUrgency: updated.urgencyLevel ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("BOOKING_CONFIRM_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
