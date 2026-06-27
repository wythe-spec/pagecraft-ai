"use client";

import { Message } from "@/lib/types";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { AlertCircle } from "lucide-react";

interface ChatPanelProps {
  projectName: string;
  messages: Message[];
  isLoading: boolean;
  error?: Error;
  onSend: (message: string) => void;
  onStop?: () => void;
  onSelectPrompt: (text: string) => void;
}

export function ChatPanel({
  projectName,
  messages,
  isLoading,
  error,
  onSend,
  onStop,
  onSelectPrompt,
}: ChatPanelProps) {
  return (
    <div className="flex flex-col h-full border-r overflow-hidden">
      <div className="flex items-center h-12 px-4 border-b shrink-0">
        <h2 className="font-medium text-sm truncate">{projectName}</h2>
      </div>
      {error && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 text-destructive px-3 py-2 text-sm shrink-0">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Generation failed</p>
            <p className="text-xs mt-0.5 opacity-80">{error.message}</p>
          </div>
        </div>
      )}
      <MessageList messages={messages} isLoading={isLoading} onSelectPrompt={onSelectPrompt} />
      <ChatInput onSend={onSend} onStop={onStop} isLoading={isLoading} />
    </div>
  );
}
