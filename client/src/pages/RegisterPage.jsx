import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setSession, validateSession } from "../lib/authClient";
import { usePageStyle, usePageTitle } from "../lib/page";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  usePageTitle("Create Account | Fintrack");
  usePageStyle("/styles/register.css");

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
    setMessage(`${provider} signup is not available yet. Please use the form.`);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setIsSuccess(false);
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await api("/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword
        })
      });

      setSession(data.token, data.user);
      setIsSuccess(true);
      setMessage("Account created. Redirecting...");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page register-page">
      <header className="auth-topbar">
        <div className="auth-container topbar-shell">
          <Link className="brand" to="/">Fintrack</Link>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </header>

      <main className="auth-container auth-layout">
        <section className="auth-visual">
          <span className="pill">Start In Minutes</span>
          <h1>Create your Fintrack account.</h1>
          <p>Set up your profile and begin managing your money with a simple, clear, and secure tracker.</p>

          <div className="feature-list">
            <article>
              <h3>Smart categorization</h3>
              <p>Auto-organize expenses with minimal manual effort.</p>
            </article>
            <article>
              <h3>Student-friendly budgets</h3>
              <p>Flexible planning cycles tailored for variable income.</p>
            </article>
            <article>
              <h3>Visual growth tracking</h3>
              <p>Follow progress with easy, focused dashboards.</p>
            </article>
          </div>
        </section>

        <section className="auth-form-wrap">
          <form className="auth-form" onSubmit={onSubmit}>
            <h2>Create Account</h2>
            <p>Fill in your details to get started.</p>

            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your full name"
              required
              value={form.fullName}
              onChange={onChange}
            />

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

            <div className="field-grid">
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create password"
                  required
                  value={form.password}
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={form.confirmPassword}
                  onChange={onChange}
                />
              </div>
            </div>

            <button className="primary-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </button>

            <div className="divider">or continue with</div>
            <div className="social-row">
              <button type="button" className="social-btn" onClick={() => onSocial("Google")}>Google</button>
              <button type="button" className="social-btn" onClick={() => onSocial("Facebook")}>Facebook</button>
            </div>

            <p className={`form-message${isSuccess ? " success" : ""}`} role="status" aria-live="polite">
              {message}
            </p>

            <p className="footnote">
              Have an account? <Link to="/login">Log in</Link>
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
