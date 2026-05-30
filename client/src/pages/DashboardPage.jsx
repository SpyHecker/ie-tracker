import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, validateSession } from "../lib/authClient";
import { usePageStyle, usePageTitle } from "../lib/page";

const transactions = [
  {
    id: 1,
    icon: "cart",
    title: "Whole Foods Market",
    meta: "Groceries • Oct 24, 2023",
    amount: "-$142.50",
    tone: "debit",
    status: "CLEARED"
  },
  {
    id: 2,
    icon: "bolt",
    title: "Pacific Gas & Electric",
    meta: "Utilities • Oct 22, 2023",
    amount: "-$85.00",
    tone: "debit",
    status: "CLEARED"
  },
  {
    id: 3,
    icon: "briefcase",
    title: "TechCorp Inc. Payroll",
    meta: "Income • Oct 15, 2023",
    amount: "+$4,225.00",
    tone: "credit",
    status: "CLEARED"
  },
  {
    id: 4,
    icon: "play",
    title: "Netflix Subscription",
    meta: "Entertainment • Oct 12, 2023",
    amount: "-$15.99",
    tone: "debit",
    status: "PENDING"
  }
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Alex");
  const [userInitial, setUserInitial] = useState("A");
  const [isLoading, setIsLoading] = useState(true);

  usePageTitle("Dashboard | Fintrack");
  usePageStyle("/styles/dashboard.css");

  useEffect(() => {
    let mounted = true;

    validateSession().then((user) => {
      if (!mounted) return;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const displayName = user.name || user.email || "Alex";
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
    <div className="db-shell">
      <aside className="db-sidebar">
        <div className="sidebar-brand">
          <h1>FinTrack</h1>
          <p>Wealth Management</p>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard sections">
          <a className="active" href="/dashboard">Dashboard</a>
          <a href="#">Transactions</a>
          <a href="#">Budgeting</a>
          <a href="#">Savings Goals</a>
        </nav>

        <div className="sidebar-foot">
          <button type="button" className="settings-btn">Settings</button>
          <button type="button" className="add-btn">+ Add Transaction</button>
          <button type="button" className="logout-link" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      <section className="db-main">
        <header className="db-topbar">
          <label className="search-wrap" aria-label="Search">
            <span>??</span>
            <input type="text" placeholder="Search transactions, categories..." />
          </label>

          <div className="top-actions">
            <button type="button" aria-label="Notifications">??</button>
            <button type="button" aria-label="Help">?</button>
            <div className="profile-chip" title={userName}>{userInitial}</div>
          </div>
        </header>

        <main className="db-content">
          <section className="welcome-row">
            <div>
              <h2>Welcome back, {userName}</h2>
              <p>Here&apos;s a summary of your finances for October.</p>
            </div>
            <div className="welcome-actions">
              <button type="button" className="ghost-btn">Export</button>
              <button type="button" className="primary-btn">+ Record Income</button>
            </div>
          </section>

          <section className="summary-grid" aria-label="Summary cards">
            <article className="card balance-card">
              <div className="card-head">
                <div>
                  <h3>Total Balance</h3>
                  <strong>$24,562.00</strong>
                  <p><span>+12.5%</span> vs last month</p>
                </div>
                <div className="bank-icon">??</div>
              </div>

              <div className="balance-chart" aria-hidden="true">
                <svg viewBox="0 0 640 160" preserveAspectRatio="none">
                  <path d="M0,132 C120,118 188,100 256,80 C334,56 430,72 520,92 C570,103 615,84 640,58" />
                </svg>
              </div>
            </article>

            <div className="income-stack">
              <article className="card stat-card income">
                <div>
                  <h3>Monthly Income</h3>
                  <strong>$8,450.00</strong>
                </div>
                <span>?</span>
              </article>
              <article className="card stat-card expense">
                <div>
                  <h3>Monthly Expenses</h3>
                  <strong>$3,240.50</strong>
                </div>
                <span>?</span>
              </article>
            </div>
          </section>

          <section className="lower-grid">
            <article className="card tx-card">
              <div className="card-title">
                <h3>Recent Transactions</h3>
                <a href="#">View All</a>
              </div>

              <div className="tx-list">
                {transactions.map((item) => (
                  <div className="tx-item" key={item.id}>
                    <div className="tx-left">
                      <div className={`tx-icon ${item.icon}`}>{item.icon === "cart" ? "??" : item.icon === "bolt" ? "?" : item.icon === "briefcase" ? "??" : "?"}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.meta}</p>
                      </div>
                    </div>

                    <div className="tx-right">
                      <strong className={item.tone}>{item.amount}</strong>
                      <small>{item.status}</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="card spend-card">
              <h3>Spending by Category</h3>

              <div className="donut-wrap">
                <div className="donut">
                  <div>
                    <span>Total</span>
                    <strong>$3.2k</strong>
                  </div>
                </div>
              </div>

              <ul className="legend">
                <li><i className="dot housing"></i><span>Housing</span><strong>45%</strong></li>
                <li><i className="dot food"></i><span>Food &amp; Dining</span><strong>30%</strong></li>
                <li><i className="dot transport"></i><span>Transportation</span><strong>25%</strong></li>
              </ul>
            </article>
          </section>
        </main>
      </section>
    </div>
  );
}
