const API_BASE = "http://localhost:3000/api/v1";

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function signup(data: any) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to sign up");
  }
  return res.json();
}

export async function signin(data: any) {
  const res = await fetch(`${API_BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to sign in");
  }
  const result = await res.json();
  if (result.token && typeof window !== "undefined") {
    localStorage.setItem("token", result.token);
  }
  return result;
}

export async function askAi(message: string, model?: string, projectId?: string) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ message, model, projectId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate AI response");
  }
  return res.json();
}

export async function sendToRenderer(id: string) {
  const res = await fetch(`${API_BASE}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to send to renderer");
  }
  return res.json();
}
