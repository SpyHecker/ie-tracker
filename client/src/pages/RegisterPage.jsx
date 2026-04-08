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

  usePageTitle("Create Account | Final Tracker");
  usePageStyle("/styles/register.css");

  useEffect(() => {
    let mounted = true;
    validateSession().then((user) => {
      if (mounted && user) {
        navigate("/", { replace: true });
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
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-shell">
      <section className="left-side">
        <Link className="home-link" to="/">Final Tracker</Link>
        <h1>
          Create Your
          <br />
          <span>Account</span>
        </h1>
        <p>
          Start tracking your income and expenses in minutes.
        </p>

        <div className="visual-stack">
          <article className="tile chart"></article>
          <article className="tile card"></article>
          <article className="tile coin"></article>
        </div>

        <small className="copyright">&copy; 2026 Final Tracker</small>
      </section>

      <section className="right-side">
        <form className="register-panel" onSubmit={onSubmit}>
          <div className="brand-row">
            <span className="brand-icon">F</span>
            <strong>Final Tracker</strong>
          </div>

          <h2>Create Account</h2>
          <p>Fill the form to get started.</p>

          <label htmlFor="fullName">FULL NAME</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your full name"
            required
            value={form.fullName}
            onChange={onChange}
          />

          <label htmlFor="email">EMAIL</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={onChange}
          />

          <div className="key-grid">
            <div>
              <label htmlFor="password">PASSWORD</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="........"
                required
                value={form.password}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="........"
                required
                value={form.confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>

          <button className="register-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          <p className={`form-message${isSuccess ? " success" : ""}`} role="status" aria-live="polite">
            {message}
          </p>

          <div className="separator">OR CONTINUE WITH</div>

          <div className="socials">
            <button type="button" onClick={() => onSocial("Google")}>GOOGLE</button>
            <button type="button" onClick={() => onSocial("Facebook")}>FACEBOOK</button>
          </div>

          <p className="switch-auth">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <p className="back-home">
            <Link to="/">Back to Home</Link>
          </p>
        </form>

        <div className="meta-strip">
          <span>Simple</span>
          <span>Fast</span>
          <span>Reliable</span>
        </div>
      </section>
    </div>
  );
}
