const API_BASE = "/api/auth";
const TOKEN_KEY = "ie_tracker_token";
const USER_KEY = "ie_tracker_user";

function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

async function validateSession() {
  const token = getToken();
  if (!token) return null;

  try {
    const data = await api("/me", { method: "GET" });
    setSession(token, data.user);
    return data.user;
  } catch {
    clearSession();
    return null;
  }
}

export { api, clearSession, setSession, validateSession };
