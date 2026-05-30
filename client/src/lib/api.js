const TOKEN_KEY = "flow_token";
const USER_KEY = "flow_user";

export function setSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

async function request(base, path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed.");
  return data;
}

export const authApi = (path, options) => request("/api/auth", path, options);
export const api = (path, options) => request("/api", path, options);

export async function validateSession() {
  if (!getToken()) return null;
  try {
    const data = await authApi("/me");
    setSession(getToken(), data.user);
    return data.user;
  } catch {
    clearSession();
    return null;
  }
}
