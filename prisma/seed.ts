import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed your database with initial data
  await prisma.user.createMany({
    data: [
      {
        email: "user3@example.com",
        name: "User 1",
      },
      {
        email: "user4@example.com",
        name: "User 2",
      },
    ],
  });

  console.log("Seed data inserted successfully");

  // Query the User table to retrieve all users
  const users = await prisma.user.findMany();

  // Log the retrieved users
  console.log("Retrieved users:", users);
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
