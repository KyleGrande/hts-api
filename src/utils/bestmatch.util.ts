import { PrismaClient } from "@prisma/client";
import { MyLocation } from "../interfaces/types";

const prisma = new PrismaClient();

export async function findBestMatch(location: MyLocation, availabilityStart: Date) {
    const locationWKT = `POINT(${location.longitude} ${location.latitude})`;

    const relevantRequests: any[] = await prisma.$queryRaw`
    SELECT id, ST_Distance(location, ST_GeomFromText(${locationWKT}, 4326)) as distance, arrivaltime
    FROM "Request"
    WHERE ST_DWithin(location, ST_GeomFromText(${locationWKT}, 4326), 402.336)
    AND status = 'Searching'::"RequestStatus"
  `;

    let bestMatch = null;
    let bestScore = Number.MAX_VALUE;

    for (const request of relevantRequests) {
        const distanceScore = request.distance;
        const timeDifference = Math.abs(new Date(request.arrivaltime).getTime() - availabilityStart.getTime());
        const score = distanceScore + timeDifference;

        if (score < bestScore) {
            bestScore = score;
            bestMatch = request;
        }
    }

    return bestMatch;
}
