import { LucideIcon } from "lucide-react";
import { Monitor, Tablet, Smartphone } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  currentHtml: string;
}

export type DeviceType = "desktop" | "tablet" | "mobile";

export interface DeviceConfig {
  type: DeviceType;
  width: number;
  label: string;
  icon: LucideIcon;
}

export const DEVICE_CONFIGS: DeviceConfig[] = [
  { type: "desktop", width: 1280, label: "Desktop", icon: Monitor },
  { type: "tablet", width: 768, label: "Tablet", icon: Tablet },
  { type: "mobile", width: 375, label: "Mobile", icon: Smartphone },
];
