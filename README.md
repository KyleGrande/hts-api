export NODE_ENV=dev
export NODE_ENV=test
export NODE_ENV=prod
npx prisma migrate dev --name init
