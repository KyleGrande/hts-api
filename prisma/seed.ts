import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed your database with initial data
  await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
      balance: 100.0,
    },
  });

  await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
      balance: 150.0,
    },
  });

  const alice = await prisma.user.findUnique({
    where: { email: "alice@example.com" },
  });
  const bob = await prisma.user.findUnique({
    where: { email: "bob@example.com" },
  });

  // Create sample transactions
  if (alice && bob) {
    await prisma.transaction.create({
      data: {
        amount: 75.0,
        type: "Debit",
        seller: { connect: { id: alice.id } },
        buyer: { connect: { id: bob.id } },
      },
    });
  }

  // Create sample parking spots
  if (alice) {
    await prisma.parkingSpot.create({
      data: {
        userId: alice.id,
        status: "Available",
        available: true,
        departureTime: new Date(),
        createdAt: new Date(),
        cost: 5.0,
        type: "Standard",
        // For location you will need to adjust this value based on your spatial data requirements
      },
    });
  }

  // Create sample requests
  if (bob) {
    await prisma.request.create({
      data: {
        userId: bob.id,
        status: "Pending",
        createdAt: new Date(),
        arrivalTime: new Date(),
        departureTime: new Date(),
        bid: 4.0,
        type: "Urgent",
      },
    });
  }
}

console.log("Seed data inserted successfully");

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
