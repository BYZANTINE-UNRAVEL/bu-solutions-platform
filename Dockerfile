FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Run as the image's unprivileged node user. It owns /app because the first start
# builds the site into .next.
WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npx prisma generate

ENV PORT=3847
EXPOSE 3847

CMD ["sh", "scripts/start.sh"]
