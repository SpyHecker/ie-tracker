import { Link } from "react-router-dom";
import { usePageStyle, usePageTitle } from "../lib/page";

export default function HomePage() {
  usePageTitle("Fintrack | Smart Budgeting");
  usePageStyle("/styles/styles.css");

  return (
    <div className="landing-page">
      <header className="site-header">
        <div className="container nav-shell">
          <Link className="brand" to="/">Fintrack</Link>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
            <a href="#support">Support</a>
          </nav>

          <div className="auth-links">
            <Link className="login-link" to="/login">Log In</Link>
            <Link className="signup-link" to="/register">Sign Up</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-wrap" id="about">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="badge">New: Smart Categorization</span>
              <h1>
                Master Your Money,
                <span>Effortlessly</span>
              </h1>
              <p>
                The clear, calm financial tracker built for students and young professionals. Remove the stress from budgeting and start building a secure financial trajectory today.
              </p>

              <div className="hero-actions">
                <Link className="btn btn-primary" to="/register">Start Tracking for Free</Link>
                <a className="btn btn-ghost" href="#features">View Demo</a>
              </div>

              <div className="social-proof">
                <div className="avatars" aria-hidden="true">
                  <span>A</span>
                  <span>R</span>
                  <span>K</span>
                </div>
                <p>Joined by 10,000+ young professionals</p>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="screen-shell">
                <div className="screen-top">
                  <span>Dashboard Overview</span>
                  <strong>80/10 Goals</strong>
                </div>

                <div className="analytics-card">
                  <h3>Outcome</h3>
                  <div className="table-head">
                    <span>Saving</span>
                    <span>200</span>
                    <span>700</span>
                  </div>
                  <div className="table-grid">
                    <div>
                      <p>42%</p>
                      <small>Budget Used</small>
                    </div>
                    <div>
                      <p>26</p>
                      <small>Transactions</small>
                    </div>
                    <div>
                      <p>+6000</p>
                      <small>Remaining</small>
                    </div>
                  </div>
                </div>

                <div className="ring">80%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="reasons" id="features">
          <div className="container">
            <div className="section-head">
              <h2>Why choose Fintrack?</h2>
              <p>
                Designed specifically for the needs of those starting their financial journey, offering clarity without overwhelming complexity.
              </p>
            </div>

            <div className="card-grid">
              <article className="reason-card">
                <div className="icon-box icon-blue">
                  <svg viewBox="0 0 24 24" role="img" aria-label="Student budgeting icon">
                    <path d="M3 9L12 4L21 9L12 14L3 9Z" fill="currentColor" />
                    <path d="M7 12V16C7 17.2 9.7 18 12 18C14.3 18 17 17.2 17 16V12" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  </svg>
                </div>
                <h3>Student-Friendly Budgeting</h3>
                <p>
                  Flexible budget cycles that align with semesters or irregular student income. Easy to adjust, impossible to break.
                </p>
              </article>

              <article className="reason-card">
                <div className="icon-box icon-sky">
                  <svg viewBox="0 0 24 24" role="img" aria-label="Categorization icon">
                    <rect x="4" y="5" width="6" height="6" rx="1" fill="currentColor" />
                    <rect x="14" y="5" width="6" height="6" rx="1" fill="currentColor" />
                    <rect x="9" y="14" width="6" height="6" rx="1" fill="currentColor" />
                  </svg>
                </div>
                <h3>Smart Expense Categorization</h3>
                <p>
                  Our AI automatically sorts your purchases into logical buckets, so you know exactly where your money goes without manual entry.
                </p>
              </article>

              <article className="reason-card">
                <div className="icon-box icon-peach">
                  <svg viewBox="0 0 24 24" role="img" aria-label="Growth chart icon">
                    <path d="M5 16L10 11L13 14L19 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 8H19V11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Visual Growth Tracking</h3>
                <p>
                  Watch your net worth grow with beautiful, easy-to-read charts. Celebrate milestones and stay motivated on your financial path.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="support">
        <div className="container footer-shell">
          <div>
            <h4>Fintrack</h4>
            <p>&copy; 2024 Fintrack Inc. Precision tools for modern professionals.</p>
          </div>

          <div className="footer-links" id="pricing">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
            <a href="#">Help Center</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
