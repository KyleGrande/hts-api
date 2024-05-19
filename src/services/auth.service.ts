// src/services/user.service.ts

import { findUserByEmail } from "./user.service";
import { comparePassword, hashPassword, generateJWT } from "../utils/auth.util";
import { createUser } from "./user.service";

export async function authEmailSigninService(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await comparePassword(password, user.password);
  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }
  generateJWT({ email: user.email, id: user.id });
  return user;
}

export async function authEmailSignupService(
  email: string,
  password: string,
  name: string
) {
  const user = await findUserByEmail(email);
  if (user) {
    throw new Error("User already exists");
  }
  let passwordValid = password.length >= 8;
  if (!passwordValid) {
    throw new Error("Password must be at least 8 characters long");
  }
  password = await hashPassword(password);
  const jwt = generateJWT({ email: email });

  const newUser = await createUser(email, password, jwt, name);
  return newUser;
}
