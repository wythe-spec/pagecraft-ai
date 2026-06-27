"use client";

import { useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";
import { QuickPrompts } from "./QuickPrompts";
import { Bot } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onSelectPrompt: (text: string) => void;
}

export function MessageList({ messages, isLoading, onSelectPrompt }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <h2 className="text-lg font-semibold mb-2">Start Building</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Describe your landing page or pick a template
        </p>
        <QuickPrompts onSelect={onSelectPrompt} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto min-h-0"
    >
      <div className="py-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <div className="flex gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-muted">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
