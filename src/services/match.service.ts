// src/services/match.service.ts

import { PrismaClient, Match } from "@prisma/client";
const prisma = new PrismaClient();

export const createMatchService = async (
  requestId: number,
  listingId: number,
  distance: number
): Promise<Match> => {
  const newMatch = await prisma.match.create({
    data: {
      requestId,
      listingId,
      distance,
    },
  });
  return newMatch;
};

export const getAllMatchesService = async () => {
  return await prisma.match.findMany();
};

export const getMatchByIdService = async (id: number) => {
  return await prisma.match.findUnique({
    where: {
      id: id,
    },
  });
};

export const deleteMatchByIdService = async (id: number) => {
  return await prisma.match.delete({
    where: {
      id: id,
    },
  });
};

export const deleteMatchByRequestIdService = async (requestId: number) => {
  return await prisma.match.deleteMany({
    where: {
      requestId: requestId,
    },
  });
};
