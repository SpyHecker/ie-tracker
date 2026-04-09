import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, validateSession } from "../lib/authClient";
import { usePageStyle, usePageTitle } from "../lib/page";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest");
  const [userInitial, setUserInitial] = useState("G");
  const [isLoading, setIsLoading] = useState(true);

  usePageTitle("Dashboard | Final Tracker");
  usePageStyle("/styles/dashboard.css");

  useEffect(() => {
    let mounted = true;

    validateSession().then((user) => {
      if (!mounted) return;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const displayName = user.name || user.email || "User";
      setUserName(displayName);
      setUserInitial(displayName.trim().charAt(0).toUpperCase());
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  function onLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  if (isLoading) {
    return <div className="db-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-body">
      <div className="page-bg"></div>

      <header className="topbar-wrap">
        <div className="topbar">
          <div className="brand">FinAI Tracker</div>

          <div className="topbar-links" role="navigation" aria-label="Primary">
            <a className="active" href="/dashboard">Dashboard</a>
            <a href="#">Add Transaction</a>
            <a href="#">Analytics</a>
            <a href="#">Reports</a>
            <a href="#">AI Insights</a>
            <a href="#">Budget Planner</a>
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" type="button" aria-label="Notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22a2.6 2.6 0 0 0 2.45-1.75h-4.9A2.6 2.6 0 0 0 12 22Zm7.3-5.2h-1.1v-5.15c0-3.3-2.03-6.06-5.05-6.86V3.9a1.15 1.15 0 1 0-2.3 0v.9C7.82 5.59 5.8 8.35 5.8 11.65v5.15H4.7a1 1 0 0 0 0 2h14.6a1 1 0 1 0 0-2Z"></path>
              </svg>
            </button>

            <button className="profile-btn" type="button">
              <span className="avatar">{userInitial}</span>
              <span>{userName}</span>
            </button>

            <button className="logout-btn" type="button" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard container">
        <section className="overview-head">
          <div>
            <h1>Portfolio Overview</h1>
            <p>Welcome back, <span>{userName}</span>, your financial health is <em>Optimal</em></p>
          </div>
          <button className="btn-cyan" type="button">+ Add Transaction</button>
        </section>

        <section className="metrics-grid" aria-label="Summary cards">
          <article className="panel metric-card metric-glow-cyan">
            <div className="metric-top">
              <span className="metric-icon">$</span>
              <span className="chip positive">+12.4%</span>
            </div>
            <p>Total Balance</p>
            <h3>$142,500.00</h3>
          </article>

          <article className="panel metric-card">
            <div className="metric-top">
              <span className="metric-icon">+%</span>
              <span className="chip neutral">+8.2%</span>
            </div>
            <p>Monthly Income</p>
            <h3>$15,200.00</h3>
          </article>

          <article className="panel metric-card">
            <div className="metric-top">
              <span className="metric-icon">-%</span>
              <span className="chip danger">-31%</span>
            </div>
            <p>Monthly Expense</p>
            <h3>$4,850.00</h3>
          </article>

          <article className="panel metric-card">
            <div className="metric-top">
              <span className="metric-icon">AI</span>
              <span className="chip success">Excellent</span>
            </div>
            <p>Savings Score</p>
            <h3>92/100</h3>
          </article>
        </section>

        <section className="content-grid">
          <div className="left-column">
            <article className="panel chart-panel">
              <div className="panel-head">
                <h2>Income vs Expense</h2>
                <div className="legend">
                  <span><i className="dot income"></i>Income</span>
                  <span><i className="dot expense"></i>Expense</span>
                </div>
              </div>

              <div className="line-chart" role="img" aria-label="Income and expense trend from January to July">
                <svg viewBox="0 0 880 320" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22e5ff" stopOpacity="0.33" />
                      <stop offset="100%" stopColor="#22e5ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className="income-fill" d="M0,236 C118,224 184,150 292,162 C380,172 440,266 540,220 C625,182 700,48 880,120 L880,320 L0,320 Z"></path>
                  <path className="income-line" d="M0,236 C118,224 184,150 292,162 C380,172 440,266 540,220 C625,182 700,48 880,120"></path>
                  <path className="expense-line" d="M0,270 C138,255 200,244 330,236 C462,228 578,236 704,224 C788,216 828,215 880,214"></path>
                </svg>
              </div>

              <div className="months" aria-hidden="true">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </article>

            <article className="panel transactions-panel">
              <div className="panel-head">
                <h2>Recent Transactions</h2>
                <a href="#">View All</a>
              </div>

              <div className="txn-list">
                <div className="txn-item">
                  <div className="txn-meta">
                    <span className="txn-icon">FD</span>
                    <div>
                      <h4>The Gourmet Bistro</h4>
                      <p>24 Oct 2023 - Food and Dining</p>
                    </div>
                  </div>
                  <strong className="amount negative">-$142.50</strong>
                </div>

                <div className="txn-item">
                  <div className="txn-meta">
                    <span className="txn-icon">IN</span>
                    <div>
                      <h4>Tech Corp Salary</h4>
                      <p>22 Oct 2023 - Income</p>
                    </div>
                  </div>
                  <strong className="amount positive">+$8,500.00</strong>
                </div>

                <div className="txn-item">
                  <div className="txn-meta">
                    <span className="txn-icon">SH</span>
                    <div>
                      <h4>Apple Store</h4>
                      <p>20 Oct 2023 - Electronics</p>
                    </div>
                  </div>
                  <strong className="amount negative">-$1,299.00</strong>
                </div>
              </div>
            </article>
          </div>

          <aside className="right-column">
            <article className="panel insight-panel">
              <h2>AI Insights</h2>
              <blockquote>
                "You spent 30% more on food this month than your usual average. Consider reducing dining out."
              </blockquote>
              <blockquote>
                "Based on your current savings trend, you can potentially save an extra $2,000 by year-end."
              </blockquote>
              <button type="button" className="outline-btn">Optimize My Budget</button>
            </article>

            <article className="panel donut-panel">
              <h2>Spending Categories</h2>
              <div className="donut-wrap">
                <div className="donut" role="img" aria-label="Housing 45, Food 30, Bills 15, Travel 10 percent">
                  <div>
                    <strong>$4,850</strong>
                    <span>Total Spent</span>
                  </div>
                </div>
              </div>
              <div className="donut-legend">
                <span><i style={{ background: "#1fe5ff" }}></i>Housing (45%)</span>
                <span><i style={{ background: "#a98bff" }}></i>Food (30%)</span>
                <span><i style={{ background: "#f7a8aa" }}></i>Bills (15%)</span>
                <span><i style={{ background: "#d7dfef" }}></i>Travel (10%)</span>
              </div>
            </article>

            <article className="panel budget-panel">
              <h2>Budget Progress</h2>

              <div className="progress-item">
                <div className="progress-top">
                  <span>Food and Dining</span>
                  <span>$4,000 / $6,000</span>
                </div>
                <div className="track"><i style={{ width: "68%", "--bar": "#23e8ff" }}></i></div>
              </div>

              <div className="progress-item">
                <div className="progress-top">
                  <span>Personal Entertainment</span>
                  <span>$1,200 / $1,500</span>
                </div>
                <div className="track"><i style={{ width: "80%", "--bar": "#ceb4ff" }}></i></div>
              </div>

              <div className="progress-item">
                <div className="progress-top">
                  <span>Automobile</span>
                  <span>$2,100 / $2,000</span>
                </div>
                <div className="track"><i style={{ width: "100%", "--bar": "#ffb2b1" }}></i></div>
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
