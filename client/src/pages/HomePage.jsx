import { Link } from "react-router-dom";
import { usePageStyle, usePageTitle } from "../lib/page";

export default function HomePage() {
  usePageTitle("Final Tracker");
  usePageStyle("/styles/styles.css");

  return (
    <>
      <div className="page-bg"></div>
      <header className="nav-wrap">
        <nav className="nav">
          <div className="logo">Final Tracker</div>
          <ul className="nav-links">
            <li><a className="active" href="#platform">Platform</a></li>
            <li><a href="#how-it-works">How it Works</a></li>
            <li><a href="#security">Security</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <h1>Track Your <span>Money</span> Easily</h1>
            <p>
              Add income and expenses in one place, and see where your money goes.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-cyan" to="/register">Start Free</Link>
            </div>
          </div>
          <div id="observatory" className="hero-card card">
            <div className="hero-card-top">
              <span className="chip">Live</span>
              <span className="status-dot"></span>
            </div>
            <div className="chart-frame">
              <svg viewBox="0 0 500 190" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M0,145 C70,140 110,160 170,125 C220,95 280,20 335,80 C385,138 430,160 500,40"
                  fill="none"
                  stroke="#2fe7ff"
                  strokeWidth="5"
                />
              </svg>
            </div>
            <div className="hero-metrics">
              <div className="metric card-small">
                <span>Balance</span>
                <strong>$45,280</strong>
              </div>
              <div className="metric card-small">
                <span>This Month</span>
                <strong>INR 12,400</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="container section">
          <div className="section-head">
            <h2>Simple Tools for Daily Money Tracking</h2>
            <p>Everything you need to track spending and save better.</p>
          </div>
          <div className="feature-grid">
            <article className="card feature">
              <h3>Expense Tracking</h3>
              <p>Keep a clear record of daily spending.</p>
            </article>
            <article className="card feature">
              <h3>Helpful Tips</h3>
              <p>Get easy suggestions to improve your budget.</p>
            </article>
            <article className="card feature">
              <h3>Clear Charts</h3>
              <p>See income and expenses with simple graphs.</p>
            </article>
            <article className="card feature">
              <h3>Budget Planning</h3>
              <p>Plan your month and track your goal progress.</p>
            </article>
            <article className="card feature">
              <h3>Data Safety</h3>
              <p>Your account data stays private and protected.</p>
            </article>
            <article className="card feature">
              <h3>Quick Reports</h3>
              <p>Check summaries anytime to make better money decisions.</p>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="container section">
          <div className="section-head">
            <h2>Overview</h2>
            <p>A quick view of your monthly progress.</p>
          </div>
          <div className="card observatory">
            <div className="obs-side">
              <div className="obs-metric">
                <span>Total Balance</span>
                <strong>INR 24,500.00</strong>
              </div>
              <div className="obs-progress">
                <span>Goal Progress</span>
                <div><i style={{ width: "70%" }}></i></div>
              </div>
            </div>
            <div className="obs-chart">
              <div className="bar" style={{ height: "48%" }}></div>
              <div className="bar" style={{ height: "72%" }}></div>
              <div className="bar" style={{ height: "38%" }}></div>
              <div className="bar" style={{ height: "58%" }}></div>
              <div className="bar" style={{ height: "66%" }}></div>
              <div className="bar" style={{ height: "31%" }}></div>
              <div className="bar" style={{ height: "81%" }}></div>
            </div>
          </div>
        </section>

        <section className="container section">
          <div className="section-head">
            <h2>How It Works in 3 Steps</h2>
          </div>
          <div className="steps">
            <article className="step">
              <div className="step-icon">1</div>
              <h3>Add Income and Expenses</h3>
              <p>Enter your daily money records.</p>
            </article>
            <article className="step">
              <div className="step-icon purple">2</div>
              <h3>See Spending Trends</h3>
              <p>Check simple category-wise summaries.</p>
            </article>
            <article className="step">
              <div className="step-icon">3</div>
              <h3>Follow Helpful Tips</h3>
              <p>Use suggestions to save more each month.</p>
            </article>
          </div>
        </section>

        <section className="container section assistant">
          <div className="assistant-copy">
            <h2>Your Money Assistant</h2>
            <p>Ask simple questions and get easy-to-read answers.</p>
            <ul>
              <li>Simple summaries for any date range</li>
              <li>Alerts and savings reminders</li>
              <li>Quick spending checks anytime</li>
            </ul>
          </div>
          <div className="card chat-card">
            <h4>Final Assistant</h4>
            <p className="msg">Your food spending was higher last week.</p>
            <p className="msg user">How can I save more next month?</p>
            <p className="msg">Try reducing takeout by 20% to save around INR 2,800.</p>
            <div className="chat-input">Ask a question...</div>
          </div>
        </section>

        <section id="security" className="container section security">
          <div className="shield">S</div>
          <h2>Your Data Stays Safe</h2>
          <p>
            We use safe sign-in and encryption to protect your account data.
          </p>
          <div className="badges">
            <span>Encrypted</span>
            <span>Private</span>
            <span>2-Step Login</span>
          </div>
        </section>

        <section id="pricing" className="container cta-wrap">
          <div className="cta card">
            <h2>Start Tracking Today</h2>
            <p>Create your free account and manage your money better.</p>
            <Link className="btn btn-dark" to="/register">Create Free Account</Link>
          </div>
        </section>
      </main>

      <footer id="legal" className="footer">
        <div className="container foot-grid">
          <div>
            <h4>Final Tracker</h4>
            <small>&copy; 2026 Final Tracker. Engineered for the future of finance.</small>
          </div>
        </div>
      </footer>
    </>
  );
}
