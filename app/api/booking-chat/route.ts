import { OpenAI } from "openai";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Sender, BookingServiceType, UrgencyLevel } from "@/src/generated/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages, bookingId, conversationId, currentMessage } = await req.json();

    if (!bookingId && !conversationId) {
      return NextResponse.json(
        { error: "Missing Booking ID or Conversation ID" },
        { status: 400 },
      );
    }

    let currentBooking = bookingId
      ? await prisma.booking.findUnique({ where: { id: bookingId } })
      : null;

    if (!currentBooking && conversationId) {
      currentBooking = await prisma.booking.findUnique({
        where: { conversationId },
      });
    }

    if (!currentBooking && conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { id: true, userId: true },
      });

      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }

      currentBooking = await prisma.booking.create({
        data: {
          conversationId: conversation.id,
          userId: conversation.userId,
        },
      });
    }

    if (!currentBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (typeof currentMessage === "string" && currentMessage.trim()) {
      await prisma.message.create({
        data: {
          conversationId: currentBooking.conversationId,
          sender: Sender.USER,
          messageText: currentMessage.trim(),
        },
      });
    }

    const systemPrompt = `You are Sahayak AI. 

CURRENT STATE (Check this before replying):
- Service: ${currentBooking.serviceType || "Missing"}
- Address: ${currentBooking.address || "Missing"}
- Description: ${currentBooking.description || "Missing"}

STRICT RULES:
1. LANGUAGE: Respond in a mix of Hindi and English (Hinglish). Example: "Got it! Phagwara ke liye cleaning service note kar li hai."
2. ADDRESS CAPTURE: If the user gives an address like "Phagwara", call 'update_booking' with the 'address' field and ACKNOWLEDGE it in the chat.
3. NO REPEATING: If the Address is already set (see above), do NOT ask for it again. Ask for the next missing field.
4. DEEP SERVICE DESCRIPTION: If the user just says "cleaning", ask for details: "Cleaning mein kya kya karwana hai? Deep cleaning ya regular?"`;

    if (!process.env.OPENAI_API_KEY) {
      const fallback = "Message received. OPENAI_API_KEY is missing, so AI reply is in fallback mode.";
      await prisma.message.create({
        data: {
          conversationId: currentBooking.conversationId,
          sender: Sender.BOT,
          messageText: fallback,
        },
      });
      return NextResponse.json({ content: fallback, extractedData: null });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      tools: [
        {
          type: "function",
          function: {
            name: "update_booking",
            description: "Updates the database with extracted service details",
            parameters: {
              type: "object",
              properties: {
                serviceType: {
                  type: "string",
                  enum: Object.values(BookingServiceType),
                },
                address: { type: "string" },
                description: { type: "string" },
                urgencyLevel: {
                  type: "string",
                  enum: Object.values(UrgencyLevel),
                },
              },
            },
          },
        },
      ],
    });

    const message = response.choices[0].message;
    let extractedData = null;

    // 2. HANDLE TOOL CALL
    if (message.tool_calls) {
      const toolCall = message.tool_calls[0];
      if (toolCall.type === "function") {
        extractedData = JSON.parse(toolCall.function.arguments);

        const updateData: any = {};
        if (extractedData.address) {
          updateData.address = extractedData.address;
        }
        if (extractedData.serviceType) {
          // Directly assign serviceType from extractedData
          updateData.serviceType = extractedData.serviceType;
        }
        if (extractedData.description) { // Handle description update
          updateData.description = extractedData.description;
        }
        if (extractedData.urgencyLevel) {
          updateData.urgencyLevel = extractedData.urgencyLevel;
        }
        
        if (Object.keys(updateData).length > 0) {
          const updatedBooking = await prisma.booking.update({
            where: { id: currentBooking.id },
            data: updateData,
          });

          await prisma.conversation.update({
            where: { id: currentBooking.conversationId },
            data: {
              detectedArea: updatedBooking.address ?? undefined,
              detectedUrgency: updatedBooking.urgencyLevel ?? undefined,
            },
          });
        }
      }
    }

    // Replace your old finalContent logic with this:
    let finalContent = message.content;

    if (!finalContent) {
      if (extractedData?.address) {
        finalContent = `Theek hai, ${extractedData.address} note kar liya hai. Aur kuch detail batana chahenge?`;
      } else if (extractedData?.serviceType) {
        finalContent = `Got it! ${extractedData.serviceType} service ke liye details update kar di hain. Aapka address kya hai?`;
      } else {
        finalContent =
          "Theek hai, details update ho gayi hain. Aapka address kya hai?";
      }
    }

    // Save AI reply to history
    await prisma.message.create({
      data: {
        conversationId: currentBooking.conversationId,
        sender: Sender.BOT,
        messageText: finalContent,
      },
    });

    return NextResponse.json({
      content: finalContent,
      extractedData,
    });
  } catch (error) {
    console.error("CHAT_ROUTE_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
