const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://taskmate-ai-hy5o.onrender.com/api";
export async function addTask(task) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add task");
  }
  return res.json();
}

export async function getTasks(userId) {
  const res = await fetch(`${API_BASE}/tasks/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

export async function aiChat(message) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  return res.json();
}
