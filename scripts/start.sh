#!/bin/sh
set -eu
npx prisma migrate deploy
npx tsx prisma/seed.ts
if [ ! -f .next/BUILD_ID ]; then
  npx next build
fi
export NODE_ENV=production
exec npx next start -p "${PORT:-3847}"
