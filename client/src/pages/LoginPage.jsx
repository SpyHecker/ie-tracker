import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { authApi, setSession, validateSession } from "../lib/api";

const DEMO = { email: "demo@flow.app", password: "flow12345" };

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    validateSession().then((u) => u && navigate("/app", { replace: true }));
  }, [navigate]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi("/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setSession(data.token, data.user);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function useDemo() {
    setForm(DEMO);
    setError("");
  }

  return (
    <Layout>
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="muted">Sign in to your Flow account.</p>

        <form onSubmit={submit} className="form">
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <button type="button" className="demo-link" onClick={useDemo}>
          Use demo account
        </button>

        <p className="auth-foot muted">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </Layout>
  );
}
