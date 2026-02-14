import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus, ConversationStatus } from "@/src/generated/prisma";

async function sendConfirmationEmail(params: {
  to: string;
  bookingId: string;
  serviceType: string | null;
  address: string | null;
  urgencyLevel: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return;
  }

  const subject = `Booking Confirmed - ${params.bookingId}`;
  const text = [
    "Your booking has been confirmed.",
    `Booking ID: ${params.bookingId}`,
    `Service: ${params.serviceType ?? "N/A"}`,
    `Address: ${params.address ?? "N/A"}`,
    `Urgency: ${params.urgencyLevel ?? "N/A"}`,
  ].join("\n");

  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject,
      text,
    }),
  });

  if (!emailRes.ok) {
    const errorText = await emailRes.text();
    throw new Error(`Email send failed: ${emailRes.status} ${errorText}`);
  }
}

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

    const userEmail =
      session.user.email ??
      (
        await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { email: true },
        })
      )?.email;

    if (userEmail) {
      try {
        await sendConfirmationEmail({
          to: userEmail,
          bookingId: updated.id,
          serviceType: updated.serviceType,
          address: updated.address,
          urgencyLevel: updated.urgencyLevel,
        });
      } catch (emailError) {
        console.error("BOOKING_CONFIRM_EMAIL_ERROR:", emailError);
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("BOOKING_CONFIRM_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
