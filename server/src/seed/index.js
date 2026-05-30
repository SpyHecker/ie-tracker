const Transaction = require("../models/Transaction");
const { ensureDemoUser } = require("../services/userService");
const { countByUser, createTransaction } = require("../services/transactionService");

async function ensureDemoTransactions() {
  const demoUser = await ensureDemoUser();
  const userId = demoUser._id;
  const existing = await countByUser(userId);

  if (existing > 0) {
    return;
  }

  const now = new Date();
  const daysAgo = (days) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date;
  };

  const samples = [
    { type: "income", category: "Salary", amount: 3200, description: "Monthly salary", date: daysAgo(2) },
    { type: "income", category: "Freelance", amount: 450, description: "Design project", date: daysAgo(18) },
    { type: "expense", category: "Rent", amount: 1100, description: "Apartment rent", date: daysAgo(3) },
    { type: "expense", category: "Groceries", amount: 86.4, description: "Weekly groceries", date: daysAgo(1) },
    { type: "expense", category: "Transport", amount: 42.5, description: "Transit pass", date: daysAgo(5) },
    { type: "expense", category: "Dining", amount: 28.75, description: "Lunch with friends", date: daysAgo(4) },
    { type: "expense", category: "Utilities", amount: 95.2, description: "Electric bill", date: daysAgo(12) },
    { type: "expense", category: "Subscriptions", amount: 15.99, description: "Streaming plan", date: daysAgo(6) },
    { type: "expense", category: "Shopping", amount: 64.3, description: "House essentials", date: daysAgo(9) },
    { type: "income", category: "Refund", amount: 24.5, description: "Store refund", date: daysAgo(7) }
  ];

  for (const sample of samples) {
    await createTransaction({
      userId,
      type: sample.type,
      category: sample.category,
      amount: sample.amount,
      description: sample.description,
      date: sample.date,
      status: "cleared"
    });
  }

  console.log("Demo transactions seeded");
}

module.exports = { ensureDemoTransactions };
