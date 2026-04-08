const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { port } = require("./config/env");
const authRoutes = require("./routes/auth.routes");

const app = express();
const clientDistPath = path.resolve(process.cwd(), "client", "dist");
const clientIndexPath = path.join(clientDistPath, "index.html");
const hasClientBuild = fs.existsSync(clientIndexPath);

app.use(cors());
app.use(express.json());
if (hasClientBuild) {
  app.use(express.static(clientDistPath));
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  if (!hasClientBuild) {
    return res.status(503).json({
      message: "Client app is not built. Run `npm run build` first."
    });
  }

  return res.sendFile(clientIndexPath);
});

app.get(/^\/(?!api|health).*/, (_req, res) => {
  if (!hasClientBuild) {
    return res.status(503).json({
      message: "Client app is not built. Run `npm run build` first."
    });
  }

  return res.sendFile(clientIndexPath);
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
