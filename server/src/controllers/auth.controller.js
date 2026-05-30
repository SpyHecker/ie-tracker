const bcrypt = require("bcryptjs");
const {
  toPublicUser,
  findUserByEmail,
  findUserById,
  createUser,
  updateMonthlyBudget
} = require("../services/userService");
const { createAuthToken } = require("../utils/token");

async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    passwordHash
  });

  const token = createAuthToken({
    id: user._id.toString(),
    email: user.email,
    name: user.name
  });

  return res.status(201).json({
    token,
    user: toPublicUser(user)
  });
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = createAuthToken({
    id: user._id.toString(),
    email: user.email,
    name: user.name
  });

  return res.json({
    token,
    user: toPublicUser(user)
  });
}

async function me(req, res) {
  const user = await findUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user: toPublicUser(user) });
}

async function updateProfile(req, res) {
  const { monthlyBudget } = req.body || {};

  if (monthlyBudget === undefined) {
    return res.status(400).json({ message: "monthlyBudget is required." });
  }

  const parsed = Number(monthlyBudget);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return res.status(400).json({ message: "monthlyBudget must be a non-negative number." });
  }

  const user = await updateMonthlyBudget(req.user.id, Number(parsed.toFixed(2)));

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user: toPublicUser(user) });
}

module.exports = {
  register,
  login,
  me,
  updateProfile
};
