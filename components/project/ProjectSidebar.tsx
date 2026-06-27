"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Pencil, Zap } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ProjectSidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function ProjectSidebar({
  projects,
  activeProjectId,
  onSelect,
  onCreate,
  onDelete,
  onRename,
}: ProjectSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startRename = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const confirmRename = (id: string) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="w-60 border-r flex flex-col h-full shrink-0 bg-background">
      <div className="flex items-center justify-between p-3 shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">PageCraft AI</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCreate}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {projects.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              Create your first project
            </p>
          )}
          {projects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors",
                activeProjectId === project.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
              onClick={() => onSelect(project.id)}
            >
              {editingId === project.id ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => confirmRename(project.id)}
                  onKeyDown={(e) => e.key === "Enter" && confirmRename(project.id)}
                  className="h-6 text-sm"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span className="truncate flex-1">{project.name}</span>
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    <button
                      className="p-1 rounded hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(project);
                      }}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-destructive/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
