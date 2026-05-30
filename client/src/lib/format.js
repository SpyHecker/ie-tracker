export const INCOME_CATS = ["Salary", "Freelance", "Business", "Gift", "Other"];
export const EXPENSE_CATS = [
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Fun",
  "Other"
];

export function catsFor(type) {
  return type === "income" ? INCOME_CATS : EXPENSE_CATS;
}

export function money(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
