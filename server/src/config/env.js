const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ie-tracker",
  nodeEnv: process.env.NODE_ENV || "development"
};
