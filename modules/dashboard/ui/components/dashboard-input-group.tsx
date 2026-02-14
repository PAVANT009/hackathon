"use client"

import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { AudioLines, Plus, Loader2 } from "lucide-react" // Import Loader2
import TextareaAutosize from "react-textarea-autosize"

export function InputGroupCustom() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  const router = useRouter(); // Initialize router

  useEffect(() => {
    let active = true;

    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipwho.is/");
        if (!res.ok) return;

        const data = await res.json();
        if (!active || !data?.success) return;

        const parts = [data.city, data.region, data.country].filter(Boolean);
        if (parts.length > 0) {
          setDetectedLocation(parts.join(", "));
        }
      } catch {
        // Ignore location failures and continue normal flow
      }
    };

    fetchLocation();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async () => {
    if (input.trim() === "" || isLoading) return;

    setIsLoading(true);
    try {
      const messageWithLocation = detectedLocation
        ? `${input}\n\nApproximate location: ${detectedLocation}`
        : input;

      const response = await fetch('/api/chat/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initialMessage: messageWithLocation }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const conversationId = data.conversationId;

      if (conversationId) {
        router.push(`/chat/${conversationId}`);
        setInput(""); // Clear input after successful submission
      }
    } catch (error) {
      console.error("Failed to start new chat:", error);
      // TODO: Show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid w-full gap-6">
      <InputGroup>
        <TextareaAutosize
          value={input} // Bind value to state
          onChange={handleChange}
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Autoresize textarea..."
          onKeyDown={(e) => { // Allow submitting with Enter key
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <InputGroupAddon align="block-end">
        {
          input.trim() !== "" ? (
            <InputGroupButton className="ml-auto" size="sm" variant="default" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit'}
            </InputGroupButton>
          ): (
            <InputGroupButton className="ml-auto" size="sm" variant="default" disabled>
              <AudioLines/>
            </InputGroupButton>
          )
        }
          
        </InputGroupAddon>
      </InputGroup>
      {detectedLocation ? (
        <p className="text-xs text-muted-foreground">
          Using approximate location: {detectedLocation}
        </p>
      ) : null}

      {/* Hidden file input */}
    </div>
  )
}
