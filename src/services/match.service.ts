// src/services/match.service.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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