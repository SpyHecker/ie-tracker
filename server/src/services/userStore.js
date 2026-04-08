const fs = require("fs/promises");
const path = require("path");

const usersFilePath = path.resolve(__dirname, "../data/users.json");

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

module.exports = {
  findUserByEmail,
  addUser,
  findUserById
};
