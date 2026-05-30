import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import AppShell from "../components/AppShell";
import { api, authApi, validateSession } from "../lib/api";
import { catsFor, fmtDate, money } from "../lib/format";

const COLORS = ["#0d9488", "#0891b2", "#0284c7", "#6366f1", "#7c3aed", "#db2777"];
const EMPTY = {
  type: "expense",
  category: "Food",
  amount: "",
  description: "",
  date: new Date().toISOString().slice(0, 10)
};

export default function AppPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const budgetTimer = useRef(null);

  const load = useCallback(async (opts = {}) => {
    const q = new URLSearchParams();
    const type = opts.type ?? filter;
    const qSearch = opts.search ?? search;
    if (type !== "all") q.set("type", type);
    if (qSearch.trim()) q.set("search", qSearch.trim());
    const qs = q.toString();

    const [sum, list] = await Promise.all([
      api("/transactions/summary"),
      api(`/transactions${qs ? `?${qs}` : ""}`)
    ]);
    setSummary(sum);
    setTransactions(list.transactions || []);
  }, [filter, search]);

  useEffect(() => {
    let ok = true;
    (async () => {
      const u = await validateSession();
      if (!ok) return;
      if (!u) {
        navigate("/login", { replace: true });
        return;
      }
      setUser(u);
      try {
        await load();
      } catch (err) {
        setError(err.message);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, [navigate, load]);

  const categories = useMemo(() => catsFor(form.type), [form.type]);
  const budget = user?.monthlyBudget ?? 0;
  const budgetPct =
    budget > 0 && summary ? Math.min(100, Math.round((summary.expense / budget) * 100)) : 0;

  function openAdd(type = "expense") {
    setEditId(null);
    setForm({ ...EMPTY, type, category: catsFor(type)[0] });
    setModal(true);
  }

  function openEdit(tx) {
    setEditId(tx.id);
    setForm({
      type: tx.type,
      category: tx.category,
      amount: String(tx.amount),
      description: tx.description,
      date: new Date(tx.date).toISOString().slice(0, 10)
    });
    setModal(true);
  }

  function closeModal() {
    setModal(false);
    setEditId(null);
    setForm(EMPTY);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        type: form.type,
        category: form.category,
        amount: Number(form.amount),
        description: form.description,
        date: form.date
      };
      if (editId) {
        await api(`/transactions/${editId}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/transactions", { method: "POST", body: JSON.stringify(body) });
      }
      closeModal();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this entry?")) return;
    setError("");
    try {
      await api(`/transactions/${id}`, { method: "DELETE" });
      if (editId === id) closeModal();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function onBudgetChange(e) {
    const val = e.target.value;
    setUser((u) => ({ ...u, monthlyBudget: Number(val) || 0 }));
    if (budgetTimer.current) clearTimeout(budgetTimer.current);
    budgetTimer.current = setTimeout(async () => {
      try {
        const data = await authApi("/profile", {
          method: "PATCH",
          body: JSON.stringify({ monthlyBudget: Number(val) || 0 })
        });
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      }
    }, 500);
  }

  if (loading) {
    return (
      <div className="screen-center">
        <p className="muted">Loading workspace…</p>
      </div>
    );
  }

  return (
    <AppShell user={user}>
      <div className="workspace">
        <header className="page-head">
          <div>
            <h1>Hi, {user?.name?.split(" ")[0] || "there"}</h1>
            <p className="muted">Your money at a glance</p>
          </div>
          <div className="head-actions">
            <button type="button" className="btn btn-outline" onClick={() => openAdd("income")}>
              + Income
            </button>
            <button type="button" className="btn" onClick={() => openAdd("expense")}>
              <Plus size={18} /> Expense
            </button>
          </div>
        </header>

        {error && <p className="banner-error">{error}</p>}

        <section className="stat-row">
          <div className="stat">
            <span>Balance</span>
            <strong>{money(summary?.balance)}</strong>
          </div>
          <div className="stat">
            <span>Income</span>
            <strong className="positive">{money(summary?.income)}</strong>
          </div>
          <div className="stat">
            <span>Expenses</span>
            <strong className="negative">{money(summary?.expense)}</strong>
          </div>
          <div className="stat">
            <span>Saved</span>
            <strong>{summary?.savingsRate ?? 0}%</strong>
          </div>
        </section>

        <section className="panel budget-panel">
          <div className="budget-head">
            <h2>Monthly budget</h2>
            <label className="budget-field">
              <span className="sr-only">Budget amount</span>
              <input
                type="number"
                min="0"
                step="100"
                value={budget}
                onChange={onBudgetChange}
              />
            </label>
          </div>
          <div className="budget-bar">
            <div className="budget-fill" style={{ width: `${budgetPct}%` }} />
          </div>
          <p className="muted budget-meta">
            {money(summary?.expense)} spent of {money(budget)} ·{" "}
            <strong>{money(budget - (summary?.expense || 0))}</strong> left
          </p>
        </section>

        <div className="grid-2">
          <section className="panel">
            <h2>By category</h2>
            {!summary?.byCategory?.length ? (
              <p className="muted empty">No expenses yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={summary.byCategory.slice(0, 6)}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={50}
                    outerRadius={78}
                    paddingAngle={3}
                  >
                    {summary.byCategory.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => money(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </section>

          <section className="panel">
            <h2>Last 6 months</h2>
            {!summary?.monthlyTrend?.length ? (
              <p className="muted empty">Add entries to see trends.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={summary.monthlyTrend}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={48} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="income" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>

        <section className="panel">
          <div className="panel-head">
            <h2>Transactions</h2>
            <div className="filters">
              <input
                type="search"
                placeholder="Search…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  load({ search: e.target.value }).catch(() => {});
                }}
              />
              {["all", "income", "expense"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={filter === t ? "chip active" : "chip"}
                  onClick={() => {
                    setFilter(t);
                    load({ type: t }).catch(() => {});
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {!transactions.length ? (
            <p className="muted empty">Nothing here yet — add your first entry above.</p>
          ) : (
            <ul className="tx-list">
              {transactions.map((tx) => (
                <li key={tx.id}>
                  <div className="tx-main">
                    <strong>{tx.description}</strong>
                    <span className="muted">
                      {tx.category} · {fmtDate(tx.date)}
                    </span>
                  </div>
                  <div className="tx-right">
                    <span className={tx.type === "income" ? "positive" : "negative"}>
                      {tx.type === "income" ? "+" : "−"}
                      {money(tx.amount)}
                    </span>
                    <div className="tx-btns">
                      <button type="button" className="icon-btn" onClick={() => openEdit(tx)}>
                        <Pencil size={15} />
                      </button>
                      <button type="button" className="icon-btn danger" onClick={() => remove(tx.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {modal && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editId ? "Edit entry" : "New entry"}</h2>
              <button type="button" className="icon-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={save} className="form">
              <div className="type-toggle">
                {["expense", "income"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={form.type === t ? "active" : ""}
                    onClick={() =>
                      setForm({ ...form, type: t, category: catsFor(t)[0] })
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
              <label>
                Amount (₹)
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </label>
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Description
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What was this for?"
                />
              </label>
              <label>
                Date
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </label>
              <button type="submit" className="btn btn-full" disabled={saving}>
                {saving ? "Saving…" : editId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
