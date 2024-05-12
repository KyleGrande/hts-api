import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(
  email: string,
  name?: string,
  balance?: number
): Promise<User> {
  return prisma.user.create({
    data: { email, name, balance },
  });
}

export async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUser(
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

export async function deleteUser(id: number): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}

export async function listUsers(): Promise<User[]> {
  return prisma.user.findMany();
}
