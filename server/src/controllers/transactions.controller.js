const crypto = require("crypto");
const {
  toPublicTransaction,
  listByUser,
  createTransaction,
  findByIdForUser,
  updateById,
  deleteById
} = require("../services/transactionService");

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function monthKey(d) {
  const date = new Date(d);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${m}`;
}

function monthLabel(key) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit"
  });
}

function computeSummary(rows) {
  let income = 0;
  let expense = 0;
  for (const t of rows) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  const balance = income - expense;

  const catMap = new Map();
  for (const t of rows) {
    if (t.type !== "expense") continue;
    catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
  }
  const byCategory = [...catMap.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const monthMap = new Map();
  for (const t of rows) {
    const key = monthKey(t.date);
    if (!monthMap.has(key)) {
      monthMap.set(key, { month: key, label: monthLabel(key), income: 0, expense: 0 });
    }
    const e = monthMap.get(key);
    if (t.type === "income") e.income += t.amount;
    else e.expense += t.amount;
  }
  const monthlyTrend = [...monthMap.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  const recent = rows.slice(0, 8).map(toPublicTransaction);

  return {
    income,
    expense,
    balance,
    count: rows.length,
    savingsRate: income > 0 ? Math.round(((income - expense) / income) * 1000) / 10 : 0,
    byCategory,
    monthlyTrend,
    recent
  };
}

async function list(req, res) {
  const rows = await listByUser(req.user.id, {
    type: req.query.type,
    search: String(req.query.search || "").trim()
  });
  return res.json({ transactions: rows.map(toPublicTransaction) });
}

async function create(req, res) {
  const { type, category, amount, description, date, status } = req.body || {};

  if (!type || !category || amount === undefined || !description || !date) {
    return res.status(400).json({
      message: "type, category, amount, description, and date are required."
    });
  }
  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "type must be income or expense." });
  }

  const parsedAmount = toNumber(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: "amount must be a positive number." });
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: "date must be valid." });
  }

  const transaction = await createTransaction({
    userId: req.user.id,
    type,
    category: String(category).trim(),
    amount: Number(parsedAmount.toFixed(2)),
    description: String(description).trim(),
    date: parsedDate,
    status: status === "pending" ? "pending" : "cleared"
  });

  return res.status(201).json({ transaction: toPublicTransaction(transaction) });
}

async function remove(req, res) {
  const deleted = await deleteById(req.user.id, req.params.id);
  if (!deleted) return res.status(404).json({ message: "Transaction not found." });
  return res.json({ transaction: toPublicTransaction(deleted) });
}

async function update(req, res) {
  const { type, category, amount, description, date, status } = req.body || {};
  const existing = await findByIdForUser(req.user.id, req.params.id);
  if (!existing) return res.status(404).json({ message: "Transaction not found." });

  const nextType = type || existing.type;
  if (!["income", "expense"].includes(nextType)) {
    return res.status(400).json({ message: "type must be income or expense." });
  }

  let nextAmount = existing.amount;
  if (amount !== undefined) {
    const parsedAmount = toNumber(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "amount must be a positive number." });
    }
    nextAmount = Number(parsedAmount.toFixed(2));
  }

  let nextDate = existing.date;
  if (date !== undefined) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "date must be valid." });
    }
    nextDate = parsedDate;
  }

  const updated = await updateById(req.user.id, req.params.id, {
    type: nextType,
    category: category !== undefined ? String(category).trim() : existing.category,
    amount: nextAmount,
    description: description !== undefined ? String(description).trim() : existing.description,
    date: nextDate,
    status: status === "pending" || status === "cleared" ? status : existing.status
  });

  return res.json({ transaction: toPublicTransaction(updated) });
}

async function summary(req, res) {
  const rows = await listByUser(req.user.id);
  return res.json(computeSummary(rows));
}

module.exports = { list, create, update, remove, summary };
