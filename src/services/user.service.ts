import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export function createUser(
  email: string,
  name?: string,
  balance?: number
): Promise<User> {
  return prisma.user.create({
    data: { email, name, balance },
  });
}

export function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export function updateUser(
  id: number,
  email?: string,
  name?: string,
  balance?: number
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { email, name, balance },
  });
}

export function deleteUser(id: number): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}

export function listUsers(): Promise<User[]> {
  return prisma.user.findMany();
}
