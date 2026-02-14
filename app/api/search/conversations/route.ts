import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: session.user.id,
        ...(q
          ? {
              OR: [
                { id: { contains: q } },
                {
                  messages: {
                    some: {
                      messageText: {
                        contains: q,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: 12,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { messageText: true },
        },
        booking: {
          select: { serviceType: true, bookingStatus: true },
        },
      },
    });

    const result = conversations.map((c) => ({
      id: c.id,
      title: c.messages[0]?.messageText?.slice(0, 60) || `Chat ${c.id.slice(0, 8)}`,
      serviceType: c.booking?.serviceType ?? null,
      bookingStatus: c.booking?.bookingStatus ?? null,
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("SEARCH_CONVERSATIONS_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
