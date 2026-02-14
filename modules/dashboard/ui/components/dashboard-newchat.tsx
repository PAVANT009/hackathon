"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { InputGroupCustom } from "./dashboard-input-group";

const quickPrompts = [
  "Book me plumbing, I am in Chennai.",
  "Need an electrician tomorrow evening in Tirupati.",
  "I need house cleaning service for a 2BHK this weekend.",
];

export default function DashboardNewChat() {
  const router = useRouter();
  const [loadingPrompt, setLoadingPrompt] = useState<string | null>(null);

  const handlePromptClick = async (prompt: string) => {
    if (loadingPrompt) return;
    setLoadingPrompt(prompt);

    try {
      const response = await fetch("/api/chat/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initialMessage: prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data?.conversationId) {
        router.push(`/chat/${data.conversationId}`);
      }
    } catch (error) {
      console.error("Failed to start prompt chat:", error);
    } finally {
      setLoadingPrompt(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-48 gap-5">
      <div className="text-4xl w-3/4 font-medium bg-linear-to-r from-black via-primary to-secondary bg-clip-text text-transparent dark:text-shadow-2xs">
        Hello Pavan! <br />
        <span>what do you have in mind</span>
      </div>
      <div className="text-muted-foreground/50 font-medium">
        use common fellow prompts below or write your own
      </div>
      <div className="flex flex-row gap-2.5">
        {quickPrompts.map((prompt) => {
          const isLoading = loadingPrompt === prompt;
          return (
            <button
              key={prompt}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              disabled={Boolean(loadingPrompt)}
              className="h-32 w-52 bg-muted border border-border rounded-md px-2 py-2.5 font-medium text-muted-foreground text-left transition hover:bg-accent disabled:opacity-60"
            >
              <div className="line-clamp-4">{prompt}</div>
              {isLoading ? <Loader2 className="mt-2 h-4 w-4 animate-spin" /> : null}
            </button>
          );
        })}
      </div>
      <InputGroupCustom />
    </div>
  );
}
