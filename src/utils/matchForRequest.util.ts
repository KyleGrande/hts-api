import { PrismaClient } from "@prisma/client";
import { MyLocation } from "../interfaces/types";

const prisma = new PrismaClient();

export async function findBestMatchForRequest(location: MyLocation, arrivalTime: Date) {
    const locationWKT = `POINT(${location.longitude} ${location.latitude})`;

    const relevantListings: any[] = await prisma.$queryRaw`
    SELECT id, ST_Distance(location, ST_GeomFromText(${locationWKT}, 4326)) as distance, availabilitystart
    FROM "Listing"
    WHERE ST_DWithin(location, ST_GeomFromText(${locationWKT}, 4326), 402.336)
    AND status = 'Available'::"ListingStatus"
  `;

    let bestMatch = null;
    let bestScore = Number.MAX_VALUE;

    for (const listing of relevantListings) {
        const distanceScore = listing.distance;
        const timeDifference = Math.abs(new Date(listing.availabilitystart).getTime() - arrivalTime.getTime());
        const score = distanceScore + timeDifference;

        if (score < bestScore) {
            bestScore = score;
            bestMatch = listing;
        }
    }

    return bestMatch;
}
