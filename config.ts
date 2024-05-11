// config.js
const dotenv = require("dotenv");
const path = require("path");

// Use NODE_ENV to determine which .env file to load
const env = process.env.NODE_ENV || "development"; // Default to 'development' if NODE_ENV is not set
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });
