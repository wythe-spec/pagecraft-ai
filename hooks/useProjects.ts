"use client";

import { useState, useEffect, useCallback } from "react";
import { Project, Message } from "@/lib/types";
import {
  getProjects as loadProjects,
  getProject,
  saveProject,
  deleteProject as removeProject,
  createProject as makeProject,
} from "@/lib/storage";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const refreshProjects = useCallback(() => {
    setProjects(loadProjects());
  }, []);

  const createNewProject = useCallback((name: string): Project => {
    const project = makeProject(name);
    setProjects((prev) => [project, ...prev]);
    setActiveProject(project);
    return project;
  }, []);

  const selectProject = useCallback((id: string) => {
    const project = getProject(id);
    if (project) setActiveProject(project);
  }, []);

  const renameProject = useCallback(
    (id: string, name: string) => {
      const project = getProject(id);
      if (project) {
        const updated = { ...project, name };
        saveProject(updated);
        if (activeProject?.id === id) setActiveProject(updated);
        refreshProjects();
      }
    },
    [activeProject, refreshProjects]
  );

  const deleteProj = useCallback(
    (id: string) => {
      removeProject(id);
      if (activeProject?.id === id) {
        const remaining = loadProjects();
        setActiveProject(remaining[0] ?? null);
      }
      refreshProjects();
    },
    [activeProject, refreshProjects]
  );

  const updateProjectHtml = useCallback(
    (id: string, html: string) => {
      const project = getProject(id);
      if (project) {
        const updated = { ...project, currentHtml: html };
        saveProject(updated);
        if (activeProject?.id === id) setActiveProject(updated);
      }
    },
    [activeProject]
  );

  const addMessage = useCallback(
    (projectId: string, message: Message) => {
      const project = getProject(projectId);
      if (project) {
        const updated = {
          ...project,
          messages: [...project.messages, message],
        };
        saveProject(updated);
        if (activeProject?.id === projectId) setActiveProject(updated);
      }
    },
    [activeProject]
  );

  const updateLastAssistantMessage = useCallback(
    (projectId: string, content: string) => {
      const project = getProject(projectId);
      if (project && project.messages.length > 0) {
        const msgs = [...project.messages];
        const lastIdx = msgs.length - 1;
        if (msgs[lastIdx].role === "assistant") {
          msgs[lastIdx] = { ...msgs[lastIdx], content };
          const updated = { ...project, messages: msgs };
          saveProject(updated);
          if (activeProject?.id === projectId) setActiveProject(updated);
        }
      }
    },
    [activeProject]
  );

  return {
    projects,
    activeProject,
    setActiveProject,
    createNewProject,
    selectProject,
    renameProject,
    deleteProj,
    updateProjectHtml,
    addMessage,
    updateLastAssistantMessage,
    refreshProjects,
  };
}
