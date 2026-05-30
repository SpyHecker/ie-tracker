const bcrypt = require("bcryptjs");
const User = require("../models/User");

const DEMO_EMAIL = "demo@flow.app";
const DEMO_PASSWORD = "flow12345";

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    monthlyBudget: user.monthlyBudget,
    createdAt: user.createdAt
  };
}

async function findUserByEmail(email) {
  return User.findOne({ email: email.trim().toLowerCase() });
}

async function findUserById(id) {
  return User.findById(id);
}

async function createUser({ name, email, passwordHash, monthlyBudget }) {
  return User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    monthlyBudget: monthlyBudget ?? 2000
  });
}

async function updateMonthlyBudget(userId, monthlyBudget) {
  return User.findByIdAndUpdate(userId, { monthlyBudget }, { new: true, runValidators: true });
}

async function ensureDemoUser() {
  let user = await findUserByEmail(DEMO_EMAIL);
  if (user) return user;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  user = await createUser({
    name: "Demo",
    email: DEMO_EMAIL,
    passwordHash,
    monthlyBudget: 2000
  });
  return user;
}

module.exports = {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  toPublicUser,
  findUserByEmail,
  findUserById,
  createUser,
  updateMonthlyBudget,
  ensureDemoUser
};
