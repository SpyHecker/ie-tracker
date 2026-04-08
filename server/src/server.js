const express = require("express");
const cors = require("cors");
const path = require("path");
const { port } = require("./config/env");
const authRoutes = require("./routes/auth.routes");

const app = express();
const clientPath = path.resolve(process.cwd(), "client");

app.use(cors());
app.use(express.json());
app.use(express.static(clientPath));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || "Something went wrong."
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
