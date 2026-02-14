"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookingDetailsForm } from "@/modules/bookings/ui/components/booking-details-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Sender = "USER" | "BOT";
type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
type UrgencyLevel = "NORMAL" | "URGENT";
type BookingServiceType = "PLUMBING" | "ELECTRICAL" | "CLEANING" | "CARPENTRY" | "OTHER";

type ChatMessage = {
  id: string;
  sender: Sender;
  messageText: string;
  createdAt: string;
};

type BookingState = {
  id: string;
  serviceType: BookingServiceType | null;
  address: string | null;
  description: string | null;
  urgencyLevel: UrgencyLevel;
  bookingStatus: BookingStatus;
};

type Props = {
  conversationId: string;
  bookingId: string | null;
  initialMessages: ChatMessage[];
  initialBooking: BookingState | null;
  status: "ACTIVE" | "COMPLETED";
};

export default function ChatThread({
  conversationId,
  bookingId,
  initialMessages,
  initialBooking,
  status
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingState | null>(initialBooking);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [confirmServiceType, setConfirmServiceType] = useState<BookingServiceType | "">(
    initialBooking?.serviceType ?? ""
  );
  const [confirmAddress, setConfirmAddress] = useState(initialBooking?.address ?? "");
  const [confirmDescription, setConfirmDescription] = useState(initialBooking?.description ?? "");
  const [confirmUrgency, setConfirmUrgency] = useState<UrgencyLevel>(
    initialBooking?.urgencyLevel ?? "NORMAL"
  );
  const autoReplyTriggeredRef = useRef(false);

      const router = useRouter();
  

  const canSend = useMemo(() => !!conversationId && !loading, [conversationId, loading]);

  const appendBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: "BOT",
        messageText: text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const requestBotReply = async (llmMessages: { role: "user" | "assistant"; content: string }[], currentMessage?: string) => {
    const res = await fetch("/api/booking-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        bookingId: booking?.id ?? bookingId,
        currentMessage,
        messages: llmMessages,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Failed to send message");

    if (data?.extractedData && booking) {
      const nextBooking = {
        ...booking,
        serviceType: (data.extractedData.serviceType ?? booking.serviceType) as BookingServiceType | null,
        address: data.extractedData.address ?? booking.address,
        description: data.extractedData.description ?? booking.description,
      };
      setBooking(nextBooking);
      setConfirmServiceType(nextBooking.serviceType ?? "");
      setConfirmAddress(nextBooking.address ?? "");
      setConfirmDescription(nextBooking.description ?? "");
      if (data.extractedData.urgencyLevel) {
        setConfirmUrgency(data.extractedData.urgencyLevel as UrgencyLevel);
      }
    }

    appendBotMessage(data.content ?? "No response");
  };

  const onSend = async () => {
    const text = input.trim();
    if (!text || !canSend) return;

    const optimisticMessage: ChatMessage = {
      id: `tmp-${Date.now()}`,
      sender: "USER",
      messageText: text,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, optimisticMessage];
    setMessages(nextMessages);
    setInput("");

    if (text.toLowerCase() === "confirm") {
      setConfirmOpen(true);
      appendBotMessage("Great. Please review and submit the confirmation form.");
      return;
    }

    setLoading(true);

    try {
      const llmMessages: { role: "user" | "assistant"; content: string }[] = nextMessages.map((m) => ({
        role: m.sender === "USER" ? "user" : "assistant",
        content: m.messageText,
      }));
      await requestBotReply(llmMessages, text);
    } catch (error) {
      console.error(error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoReplyTriggeredRef.current) return;
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.sender !== "USER") return;

    autoReplyTriggeredRef.current = true;
    setLoading(true);

    const llmMessages = messages.map((m) => ({
      role: m.sender === "USER" ? "user" : "assistant",
      content: m.messageText,
    })) as { role: "user" | "assistant"; content: string }[];

    requestBotReply(llmMessages)
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [messages]);

  const onConfirmSubmit = async () => {
    if (!booking?.id) return;
    setConfirmLoading(true);
    try {
      const res = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          serviceType: confirmServiceType || null,
          address: confirmAddress || null,
          description: confirmDescription || null,
          urgencyLevel: confirmUrgency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to confirm booking");

      setBooking((prev) =>
        prev
          ? {
              ...prev,
              serviceType: data.serviceType ?? prev.serviceType,
              address: data.address ?? prev.address,
              description: data.description ?? prev.description,
              urgencyLevel: data.urgencyLevel ?? prev.urgencyLevel,
              bookingStatus: data.bookingStatus ?? prev.bookingStatus,
            }
          : prev
      );

      setConfirmOpen(false);
      appendBotMessage("Booking confirmed. You are all set.");
      toast.success("Booking confirmed");
      router.push("/home");

    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full gap-0">
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex-1 overflow-y-auto border border-gray-300 p-4 rounded-md mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                msg.sender === "USER"
                  ? "bg-blue-100 text-right ml-auto"
                  : "bg-gray-100 mr-auto"
              }`}
            >
              <p className="text-sm">{msg.messageText}</p>
              <span className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        {
        status == "ACTIVE" ? (
          <>
        <p className="mb-2 text-xs text-muted-foreground">
          Tip: type <code>confirm</code> to finalize booking.
        </p>

            <div className="mt-auto">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void onSend();
            }}
            disabled={!canSend}
            />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            onClick={() => void onSend()}
            disabled={!canSend || !input.trim()}
            >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
          </>
          ): null
          }
      </div>

      <div className="w-1/3 border-l border-gray-300 p-4">
        <h2 className="mb-4 text-xl font-bold">Booking Details</h2>
        {booking ? (
          <BookingDetailsForm booking={booking} />
        ) : (
          <p className="text-sm text-gray-500">No booking linked yet.</p>
        )}
        <Button
          className="mt-4 w-full"
          onClick={() => setConfirmOpen(true)}
          disabled={!booking || status == "COMPLETED" ? true: false}
        >
          Finalize Booking
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Review details and submit to confirm this booking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label>Service Type</Label>
              <select
                className="mt-1 w-full rounded-md border bg-background p-2"
                value={confirmServiceType}
                onChange={(e) => setConfirmServiceType(e.target.value as BookingServiceType | "")}
              >
                <option value="">Select service</option>
                <option value="PLUMBING">PLUMBING</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="CLEANING">CLEANING</option>
                <option value="CARPENTRY">CARPENTRY</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div>
              <Label>Address</Label>
              <Input value={confirmAddress} onChange={(e) => setConfirmAddress(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={confirmDescription}
                onChange={(e) => setConfirmDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Urgency</Label>
              <select
                className="mt-1 w-full rounded-md border bg-background p-2"
                value={confirmUrgency}
                onChange={(e) => setConfirmUrgency(e.target.value as UrgencyLevel)}
              >
                <option value="NORMAL">NORMAL</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void onConfirmSubmit()} disabled={confirmLoading || !booking}>
              {confirmLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
