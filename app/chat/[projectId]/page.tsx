"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { useProjects } from "@/hooks/useProjects";
import { usePreview } from "@/hooks/usePreview";
import { extractHtmlFromText } from "@/lib/extract-html";
import { ProjectSidebar } from "@/components/project/ProjectSidebar";
import { NewProjectDialog } from "@/components/project/NewProjectDialog";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/lib/types";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const {
    projects,
    activeProject,
    createNewProject,
    selectProject,
    renameProject,
    deleteProj,
    updateProjectHtml,
    addMessage,
    refreshProjects,
  } = useProjects();

  const {
    deviceType,
    setDeviceType,
    currentHtml,
    setHtml,
    openInNewTab,
    downloadHtml,
    copyToClipboard,
  } = usePreview();

  const [dialogOpen, setDialogOpen] = useState(false);
  const lastExtractedRef = useRef<string>("");

  // Load project on mount
  useEffect(() => {
    if (projectId) {
      selectProject(projectId);
    }
  }, [projectId, selectProject]);

  // Restore HTML from project
  useEffect(() => {
    if (activeProject?.currentHtml) {
      setHtml(activeProject.currentHtml);
    } else {
      setHtml("");
    }
    lastExtractedRef.current = "";
  }, [activeProject?.id]);

  const {
    messages: chatMessages,
    append,
    isLoading,
    stop,
    setMessages,
    error,
  } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      if (!activeProject) return;
      const msg: Message = {
        id: message.id,
        role: "assistant",
        content: message.content,
        timestamp: new Date().toISOString(),
      };
      addMessage(activeProject.id, msg);

      const html = extractHtmlFromText(message.content);
      if (html) {
        setHtml(html);
        updateProjectHtml(activeProject.id, html);
        lastExtractedRef.current = html;
      }
      refreshProjects();
    },
  });

  // Convert useChat messages to our Message type for display
  const displayMessages: Message[] = useMemo(
    () =>
      chatMessages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        timestamp: m.createdAt?.toISOString() ?? new Date().toISOString(),
      })),
    [chatMessages]
  );

  // Sync messages from project when switching projects
  useEffect(() => {
    if (activeProject && activeProject.messages.length > 0) {
      setMessages(
        activeProject.messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          createdAt: new Date(m.timestamp),
        }))
      );
    } else {
      setMessages([]);
    }
  }, [activeProject?.id]);

  // Real-time HTML extraction during streaming
  useEffect(() => {
    if (chatMessages.length > 0 && isLoading) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.role === "assistant") {
        const html = extractHtmlFromText(lastMsg.content);
        if (html && html !== lastExtractedRef.current) {
          setHtml(html);
          lastExtractedRef.current = html;
        }
      }
    }
  }, [chatMessages, isLoading, setHtml]);

  const handleSend = useCallback(
    (content: string) => {
      if (!activeProject) return;
      const userMsg: Message = {
        id: uuidv4(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };
      addMessage(activeProject.id, userMsg);
      append({ role: "user", content });
    },
    [activeProject, addMessage, append]
  );

  const handleSelectPrompt = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend]
  );

  const handleCreateProject = useCallback(
    (name: string) => {
      const project = createNewProject(name);
      router.push(`/chat/${project.id}`);
    },
    [createNewProject, router]
  );

  const handleSelectProject = useCallback(
    (id: string) => {
      router.push(`/chat/${id}`);
    },
    [router]
  );

  const handleDeleteProject = useCallback(
    (id: string) => {
      deleteProj(id);
      const remaining = projects.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        router.push(`/chat/${remaining[0].id}`);
      } else {
        router.push("/");
      }
    },
    [deleteProj, projects, router]
  );

  if (!activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <ProjectSidebar
        projects={projects}
        activeProjectId={activeProject.id}
        onSelect={handleSelectProject}
        onCreate={() => setDialogOpen(true)}
        onDelete={handleDeleteProject}
        onRename={renameProject}
      />
      <div className="flex-1 flex min-w-0">
        <div className="w-1/2 min-w-0">
          <ChatPanel
            projectName={activeProject.name}
            messages={displayMessages}
            isLoading={isLoading}
            error={error}
            onSend={handleSend}
            onStop={stop}
            onSelectPrompt={handleSelectPrompt}
          />
        </div>
        <div className="w-1/2 min-w-0">
          <PreviewPanel
            html={currentHtml}
            deviceType={deviceType}
            onDeviceChange={setDeviceType}
            onCopy={copyToClipboard}
            onDownload={() => downloadHtml(activeProject.name)}
            onOpenNewTab={openInNewTab}
          />
        </div>
      </div>
      <NewProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
