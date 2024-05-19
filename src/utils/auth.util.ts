import { config } from "../config/config";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export async function hashPassword(password: string) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    return null;
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);

    return match;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return null;
  }
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
