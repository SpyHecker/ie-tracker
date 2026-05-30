import { Link } from "react-router-dom";
import { ArrowRight, LineChart, Receipt, Target } from "lucide-react";
import Layout from "../components/Layout";

export default function LandingPage() {
  return (
    <Layout wide>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Income & expense tracker</p>
          <h1>
            See where your money
            <em> actually goes.</em>
          </h1>
          <p className="lead">
            Flow is a simple MERN app to log income and spending, watch your balance,
            and stay inside your monthly budget — no clutter, no spreadsheets.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn">
              Start free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-row">
            <span>Balance</span>
            <strong className="positive">₹12,450</strong>
          </div>
          <div className="hero-card-row">
            <span>Income</span>
            <strong>₹45,000</strong>
          </div>
          <div className="hero-card-row">
            <span>Spent</span>
            <strong className="negative">₹32,550</strong>
          </div>
          <div className="hero-bars">
            <div style={{ height: "45%" }} />
            <div style={{ height: "70%" }} />
            <div style={{ height: "55%" }} />
            <div style={{ height: "85%" }} />
            <div style={{ height: "60%" }} />
          </div>
        </div>
      </section>

      <section className="features">
        <article>
          <Receipt size={22} />
          <h3>Quick entries</h3>
          <p>Add income or expenses in a few taps with smart categories.</p>
        </article>
        <article>
          <LineChart size={22} />
          <h3>Clear charts</h3>
          <p>Monthly trends and category breakdowns at a glance.</p>
        </article>
        <article>
          <Target size={22} />
          <h3>Budget guard</h3>
          <p>Set a monthly limit and track how much room you have left.</p>
        </article>
      </section>
    </Layout>
  );
}
