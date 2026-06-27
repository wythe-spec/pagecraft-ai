"use client";

import { DeviceType, DEVICE_CONFIGS } from "@/lib/types";
import { DeviceToggle } from "./DeviceToggle";
import { ExportBar } from "./ExportBar";
import { cn } from "@/lib/utils";
import { Layout } from "lucide-react";

interface PreviewPanelProps {
  html: string;
  deviceType: DeviceType;
  onDeviceChange: (type: DeviceType) => void;
  onCopy: () => Promise<void>;
  onDownload: () => void;
  onOpenNewTab: () => void;
}

export function PreviewPanel({
  html,
  deviceType,
  onDeviceChange,
  onCopy,
  onDownload,
  onOpenNewTab,
}: PreviewPanelProps) {
  const deviceWidth = DEVICE_CONFIGS.find((d) => d.type === deviceType)?.width ?? 1280;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-12 px-4 border-b shrink-0">
        <DeviceToggle current={deviceType} onChange={onDeviceChange} />
        <ExportBar
          onCopy={onCopy}
          onDownload={onDownload}
          onOpenNewTab={onOpenNewTab}
          hasContent={!!html}
        />
      </div>
      <div className="flex-1 bg-muted/30 overflow-auto p-4">
        {html ? (
          <div className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 h-full"
            style={{ maxWidth: deviceWidth }}
          >
            <iframe
              srcDoc={html}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
              title="Page Preview"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Layout className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm">Your landing page will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
