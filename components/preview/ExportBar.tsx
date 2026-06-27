"use client";

import { useState } from "react";
import { Copy, Download, ExternalLink, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExportBarProps {
  onCopy: () => Promise<void>;
  onDownload: () => void;
  onOpenNewTab: () => void;
  hasContent: boolean;
}

export function ExportBar({ onCopy, onDownload, onOpenNewTab, hasContent }: ExportBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnClass = "inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none";

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger className={btnClass} onClick={handleCopy} disabled={!hasContent}>
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </TooltipTrigger>
        <TooltipContent>Copy HTML</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger className={btnClass} onClick={onDownload} disabled={!hasContent}>
          <Download className="w-4 h-4" />
        </TooltipTrigger>
        <TooltipContent>Download</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger className={btnClass} onClick={onOpenNewTab} disabled={!hasContent}>
          <ExternalLink className="w-4 h-4" />
        </TooltipTrigger>
        <TooltipContent>Open in new tab</TooltipContent>
      </Tooltip>
    </div>
  );
}
