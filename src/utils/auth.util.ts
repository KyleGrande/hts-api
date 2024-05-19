import { config } from "../config/config";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export async function hashPassword(password: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

export const verifyJWT = (token: string | string[]) => {
  return jwt.verify(token, config.supabaseJWT);
};

export const generateJWT = (data: any) => {
  return jwt.sign(data, config.supabaseJWT);
};

export const decodeJWT = (token: string) => {
  return jwt.decode(token);
};
