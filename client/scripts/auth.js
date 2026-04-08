(function () {
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

  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async function api(path, options) {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options && options.headers ? options.headers : {})
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...(options || {}),
      headers
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload.message || "Request failed.";
      throw new Error(message);
    }

    return payload;
  }

  async function validateSession() {
    const token = getToken();
    if (!token) {
      return null;
    }

    try {
      const data = await api("/me", { method: "GET" });
      setSession(token, data.user);
      return data.user;
    } catch {
      clearSession();
      return null;
    }
  }

  async function redirectIfAuthenticated(redirectTo) {
    const user = await validateSession();
    if (user) {
      window.location.href = redirectTo || "./index.html";
    }
    return user;
  }

  window.authClient = {
    api,
    setSession,
    clearSession,
    getToken,
    getUser,
    validateSession,
    redirectIfAuthenticated
  };
})();
