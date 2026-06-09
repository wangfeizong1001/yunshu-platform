FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server-core/package.json ./packages/server-core/
COPY packages/server-express/package.json ./packages/server-express/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build --filter=@yunshu/server-express

FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/server-core/package.json ./packages/server-core/
COPY --from=builder /app/packages/server-core/dist ./packages/server-core/dist
COPY --from=builder /app/packages/server-express/package.json ./packages/server-express/
COPY --from=builder /app/packages/server-express/dist ./packages/server-express/dist
COPY --from=builder /app/packages/api-client/package.json ./packages/api-client/
COPY --from=builder /app/packages/api-client/dist ./packages/api-client/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["node", "packages/server-express/dist/index.js"]
