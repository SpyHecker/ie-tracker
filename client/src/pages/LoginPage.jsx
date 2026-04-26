import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setSession, validateSession } from "../lib/authClient";
import { usePageStyle, usePageTitle } from "../lib/page";

export default function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  usePageTitle("Log In | Fintrack");
  usePageStyle("/styles/login.css");

  useEffect(() => {
    let mounted = true;
    validateSession().then((user) => {
      if (mounted && user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSocial(provider) {
    setIsSuccess(false);
    setMessage(`${provider} login is not available yet. Please use email and password.`);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setIsSuccess(false);
    setMessage("");
    setIsLoading(true);

    try {
      const data = await api("/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password
        })
      });

      setSession(data.token, data.user);
      setIsSuccess(true);
      setMessage("Login successful. Redirecting...");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page login-page">
      <header className="auth-topbar">
        <div className="auth-container topbar-shell">
          <Link className="brand" to="/">Fintrack</Link>
          <p>
            New here? <Link to="/register">Create account</Link>
          </p>
        </div>
      </header>

      <main className="auth-container auth-layout">
        <section className="auth-visual">
          <span className="pill">Secure Access</span>
          <h1>Welcome back to your money dashboard.</h1>
          <p>Log in to track income, review spending, and keep your financial goals on course.</p>

          <div className="metric-grid">
            <article>
              <small>Monthly Budget</small>
              <h3>$3,400</h3>
              <p>Within target this month.</p>
            </article>
            <article>
              <small>Savings Progress</small>
              <h3>78%</h3>
              <p>Goal updates in real-time.</p>
            </article>
          </div>
        </section>

        <section className="auth-form-wrap">
          <form className="auth-form" onSubmit={onSubmit}>
            <h2>Log In</h2>
            <p>Use your Fintrack account credentials.</p>

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={onChange}
            />

            <div className="row-head">
              <label htmlFor="password">Password</label>
              <Link to="/register">Forgot password?</Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={form.password}
              onChange={onChange}
            />

            <button className="primary-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <div className="divider">or continue with</div>
            <div className="social-row">
              <button type="button" className="social-btn" onClick={() => onSocial("Google")}>Google</button>
              <button type="button" className="social-btn" onClick={() => onSocial("Facebook")}>Facebook</button>
            </div>

            <div className="demo-credentials">
              <p>Demo login</p>
              <code>Email: demo@fintrack.app</code>
              <code>Password: Demo@123</code>
            </div>

            <p className={`form-message${isSuccess ? " success" : ""}`} role="status" aria-live="polite">
              {message}
            </p>

            <p className="footnote">
              Need an account? <Link to="/register">Sign up</Link>
            </p>
            <p className="footnote">
              <Link to="/">Back to home</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
