"use client";

import { useState, useCallback } from "react";
import { DeviceType } from "@/lib/types";

export function usePreview() {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [currentHtml, setCurrentHtml] = useState("");

  const setHtml = useCallback((html: string) => {
    setCurrentHtml(html);
  }, []);

  const openInNewTab = useCallback(() => {
    if (!currentHtml) return;
    const blob = new Blob([currentHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [currentHtml]);

  const downloadHtml = useCallback(
    (filename: string) => {
      if (!currentHtml) return;
      const blob = new Blob([currentHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [currentHtml]
  );

  const copyToClipboard = useCallback(async () => {
    if (!currentHtml) return;
    await navigator.clipboard.writeText(currentHtml);
  }, [currentHtml]);

  return {
    deviceType,
    setDeviceType,
    currentHtml,
    setHtml,
    openInNewTab,
    downloadHtml,
    copyToClipboard,
  };
}
