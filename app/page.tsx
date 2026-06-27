"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/storage";
import { NewProjectDialog } from "@/components/project/NewProjectDialog";
import { createProject } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const projects = getProjects();
    if (projects.length > 0) {
      router.push(`/chat/${projects[0].id}`);
    }
  }, [router]);

  const handleCreate = (name: string) => {
    const project = createProject(name);
    router.push(`/chat/${project.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="text-center space-y-6 max-w-lg px-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">PageCraft AI</h1>
        <p className="text-muted-foreground text-lg">
          Describe your idea, get a beautiful landing page in seconds.
          <br />
          Powered by AI, iterated through conversation.
        </p>
        <Button size="lg" className="gap-2" onClick={() => setDialogOpen(true)}>
          Create Your First Project <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <NewProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreate}
      />
    </div>
  );
}
