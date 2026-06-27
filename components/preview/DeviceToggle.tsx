"use client";

import { Button } from "@/components/ui/button";
import { DeviceType, DEVICE_CONFIGS } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeviceToggleProps {
  current: DeviceType;
  onChange: (type: DeviceType) => void;
}

export function DeviceToggle({ current, onChange }: DeviceToggleProps) {
  return (
    <div className="flex items-center gap-1">
      {DEVICE_CONFIGS.map((d) => {
        const Icon = d.icon;
        return (
          <Tooltip key={d.type}>
            <TooltipTrigger
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 transition-colors",
                current === d.type
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => onChange(d.type)}
            >
              <Icon className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>{d.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
