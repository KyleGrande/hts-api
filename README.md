# HTS API

export NODE_ENV=dev
npx prisma migrate dev --name dev
npx ts-node prisma/seed.ts
npm run dev

export NODE_ENV=test
export NODE_ENV=prod
