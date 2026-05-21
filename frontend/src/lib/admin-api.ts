import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getToken(): Promise<string | null> {
  const session = await getSession();
  return (session as { accessToken?: string } | null)?.accessToken ?? null;
}

async function adminRequest<T>(
  endpoint: string,
  options?: RequestInit & { method?: string; body?: BodyInit }
): Promise<T> {
  const token = await getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `API error: ${res.status}`);
  }
  return res.json();
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  content: string;
  tags: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
}

export function getMessages(): Promise<ContactMessage[]> {
  return adminRequest<ContactMessage[]>("/admin/messages");
}

export function markMessageRead(id: number): Promise<ContactMessage> {
  return adminRequest<ContactMessage>(`/admin/messages/${id}`, {
    method: "PATCH",
  });
}

export function deleteMessage(id: number): Promise<{ success: boolean }> {
  return adminRequest(`/admin/messages/${id}`, { method: "DELETE" });
}

export function createProject(data: ProjectInput): Promise<Project> {
  return adminRequest<Project>("/admin/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProject(
  id: string,
  data: Partial<ProjectInput>
): Promise<Project> {
  return adminRequest<Project>(`/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProject(id: string): Promise<{ success: boolean }> {
  return adminRequest(`/admin/projects/${id}`, { method: "DELETE" });
}
