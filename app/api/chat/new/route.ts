import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sender } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { initialMessage } = await request.json();

    if (!initialMessage || typeof initialMessage !== 'string' || initialMessage.trim() === '') {
      return NextResponse.json({ message: "Initial message is required" }, { status: 400 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        messages: {
          create: {
            messageText: initialMessage,
            sender: Sender.USER,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ conversationId: conversation.id }, { status: 201 });

  } catch (error) {
    console.error("Error creating new chat:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
