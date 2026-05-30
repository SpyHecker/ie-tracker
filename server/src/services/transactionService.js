const Transaction = require("../models/Transaction");

function toPublicTransaction(transaction) {
  return {
    id: transaction._id.toString(),
    userId: transaction.userId.toString(),
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.toISOString(),
    status: transaction.status,
    createdAt: transaction.createdAt
  };
}

async function listByUser(userId, filters = {}) {
  const query = { userId };

  if (filters.type && filters.type !== "all") {
    query.type = filters.type;
  }

  if (filters.search) {
    const pattern = new RegExp(filters.search, "i");
    query.$or = [{ description: pattern }, { category: pattern }];
  }

  const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
  return transactions;
}

async function createTransaction(payload) {
  const transaction = await Transaction.create(payload);
  return transaction;
}

async function findByIdForUser(userId, id) {
  return Transaction.findOne({ _id: id, userId });
}

async function updateById(userId, id, updates) {
  return Transaction.findOneAndUpdate({ _id: id, userId }, updates, {
    new: true,
    runValidators: true
  });
}

async function deleteById(userId, id) {
  return Transaction.findOneAndDelete({ _id: id, userId });
}

async function countByUser(userId) {
  return Transaction.countDocuments({ userId });
}

module.exports = {
  toPublicTransaction,
  listByUser,
  createTransaction,
  findByIdForUser,
  updateById,
  deleteById,
  countByUser
};
