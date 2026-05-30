const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");

const usersFilePath = path.resolve(__dirname, "../data/users.json");
const DEMO_USER_EMAIL = "demo@fintrack.app";
const DEMO_USER_PASSWORD = "Demo@123";

async function ensureUsersFile() {
  try {
    await fs.access(usersFilePath);
  } catch {
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    await fs.writeFile(usersFilePath, "[]", "utf8");
  }
}

async function readUsers() {
  await ensureUsersFile();
  const raw = await fs.readFile(usersFilePath, "utf8");
  return JSON.parse(raw);
}

async function writeUsers(users) {
  await ensureUsersFile();
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf8");
}

async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

async function addUser(user) {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
  return user;
}

async function findUserById(id) {
  const users = await readUsers();
  return users.find((user) => user.id === id) || null;
}

async function ensureDemoUser() {
  const users = await readUsers();
  const existing = users.find((user) => user.email.toLowerCase() === DEMO_USER_EMAIL);

  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(DEMO_USER_PASSWORD, 10);
  const demoUser = {
    id: "demo-user-fintrack",
    name: "Demo User",
    email: DEMO_USER_EMAIL,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(demoUser);
  await writeUsers(users);

  return demoUser;
}

module.exports = {
  findUserByEmail,
  addUser,
  findUserById,
  ensureDemoUser
};
