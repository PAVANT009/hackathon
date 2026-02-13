"use client";

import React, { useRef, useState } from "react";
import { Bot, Send, User2 } from "lucide-react";
import DashboardNavbar from "./dashboard-navbar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function DashBoardPage() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    console.log("Sending message:", message);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col p-4">
      <DashboardNavbar />

      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col gap-5 pb-6">
          <div className="flex w-full flex-row-reverse items-center gap-2 self-end">
            <User2 />
            <span className="flex h-9 min-w-[15%] items-center justify-center rounded-md bg-accent/50 px-2 text-accent-foreground/90">
              An Foid
            </span>
          </div>

          <div className="flex flex-row items-center gap-2 self-start">
            <Bot />
            <span className="flex min-h-9 min-w-[15%] max-w-[70%] items-center justify-center rounded-md bg-accent/50 px-2 py-2.5 text-accent-foreground/90">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure porro debitis quasi adipisci quisquam repudiandae
              laboriosam atque odio suscipit asperiores ullam, eveniet tenetur!
            </span>
          </div>
        </div>

        <div className="sticky bottom-0 mt-2 bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="relative mx-auto w-full max-w-3xl">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message..."
              className="chat-scroll min-h-[40px] max-h-40 w-full resize-none overflow-y-auto pr-12"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                resizeTextarea(e.currentTarget);
              }}
              onKeyDown={handleKeyDown}
            />

            {message.trim() && (
              <Button
                type="button"
                size="icon"
                onClick={handleSendMessage}
                className="absolute right-3 bottom-1 h-8 w-8 bg-primary text-primary-foreground"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
