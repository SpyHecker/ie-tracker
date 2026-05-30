const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const nodeEnv = process.env.NODE_ENV || "development";
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ie-tracker";
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

if (nodeEnv === "production" && !process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required in production.");
}

if (nodeEnv === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in production.");
}

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret,
  mongoUri,
  nodeEnv
};
