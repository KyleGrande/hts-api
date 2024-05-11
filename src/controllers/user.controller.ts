import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service"; // Assuming userService exports functions

export function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { email, name, balance } = req.body;
  userService
    .createUser(email, name, balance)
    .then((user) => res.status(201).json(user))
    .catch(next);
}

export function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  userService
    .findUserById(id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch(next);
}

export function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  const { email, name, balance } = req.body;
  userService
    .updateUser(id, email, name, balance)
    .then((user) => res.json(user))
    .catch(next);
}

export function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  userService
    .deleteUser(id)
    .then(() => res.status(204).send())
    .catch(next);
}

export function listUsers(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  userService
    .listUsers()
    .then((users) => res.json(users))
    .catch(next);
}
