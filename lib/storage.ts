import { Project } from "./types";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "pagecraft_projects";

function readStorage(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

function writeStorage(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    console.warn("localStorage write failed - storage may be full");
  }
}

export function getProjects(): Project[] {
  return readStorage().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getProject(id: string): Project | null {
  return readStorage().find((p) => p.id === id) ?? null;
}

export function saveProject(project: Project): void {
  const projects = readStorage();
  const idx = projects.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    projects[idx] = updated;
  } else {
    projects.push(updated);
  }
  writeStorage(projects);
}

export function deleteProject(id: string): void {
  const projects = readStorage().filter((p) => p.id !== id);
  writeStorage(projects);
}

export function createProject(name: string): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: uuidv4(),
    name,
    createdAt: now,
    updatedAt: now,
    messages: [],
    currentHtml: "",
  };
  const projects = readStorage();
  projects.push(project);
  writeStorage(projects);
  return project;
}
