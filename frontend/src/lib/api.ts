const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) {
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        data = undefined;
      }
      const error: ApiError = {
        message: `API error: ${res.statusText}`,
        status: res.status,
        data,
      };
      console.error("[API]", error.message, { status: res.status, data });
      throw error;
    }

    return (await res.json()) as T;
  } catch (err) {
    if ((err as ApiError).status) throw err;
    const error: ApiError = {
      message: "Network or unexpected error",
      status: 0,
      data: err,
    };
    console.error("[API]", error.message, err);
    throw error;
  }
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

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export function getProjects(): Promise<Project[]> {
  return request<Project[]>("/projects");
}

export function getProjectById(id: string): Promise<Project> {
  return request<Project>(`/projects/${id}`);
}

export function sendContactMessage(
  payload: ContactPayload
): Promise<{ success: boolean }> {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
