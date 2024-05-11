// config.ts
import { Config } from "../interfaces/types";
const dotenv = require("dotenv");
const path = require("path");

// Use NODE_ENV to determine which .env file to load
const env = process.env.NODE_ENV || "development";
// Resolve the path to the specified environment file
const envPath = path.resolve(process.cwd(), `.env.${env}`);
// Load the environment variables from the specified file
dotenv.config({ path: envPath });

export const config: Config = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.API_PORT || "3000",
  databaseUrl: process.env.DATABASE_URL || "localhost",
};
