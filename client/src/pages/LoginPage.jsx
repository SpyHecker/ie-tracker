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

  usePageTitle("Login | Final Tracker");
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
    <div className="login-shell">
      <section className="left">
        <Link className="brand" to="/">Final Tracker</Link>
        <h1>
          Welcome
          <br />
          <span>Back</span>
        </h1>
        <p>Login to continue tracking your income and expenses.</p>

        <div className="mock-grid">
          <article className="vault card">
            <span className="label">TOTAL SAVINGS</span>
            <small>THIS MONTH</small>
            <h3>$142,500.00</h3>
            <strong>+12.4% this month</strong>
          </article>
          <article className="split card">
            <span className="label">SPENDING SPLIT</span>
            <div className="bars">
              <i></i><i></i><i></i><i></i><i></i>
            </div>
          </article>
          <article className="ai card">
            <h4>Budget Tip</h4>
            <p>You can save more by lowering food delivery spend.</p>
            <span>Easy Suggestion</span>
          </article>
        </div>
      </section>

      <section className="right">
        <form className="panel" onSubmit={onSubmit}>
          <h2>Login</h2>
          <p>Enter your account details.</p>

          <div className="social-row">
            <button type="button" className="social" onClick={() => onSocial("Google")}>Google</button>
            <button type="button" className="social" onClick={() => onSocial("Facebook")}>Facebook</button>
          </div>

          <div className="separator">OR USE EMAIL</div>

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

          <div className="row">
            <label htmlFor="password">PASSWORD</label>
            <Link to="/register">Forgot password?</Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder=".............."
            required
            value={form.password}
            onChange={onChange}
          />

          <label className="checkbox">
            <input type="checkbox" />
            <span>Keep me logged in</span>
          </label>

          <button className="submit" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "LOGIN"}
          </button>

          <p className={`form-message${isSuccess ? " success" : ""}`} role="status" aria-live="polite">
            {message}
          </p>

          <p className="footnote">
            New user?
            <Link to="/register"> Create account</Link>
          </p>
          <p className="footnote">
            <Link to="/">Back to Home</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
