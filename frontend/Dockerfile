FROM oven/bun:latest AS deps
WORKDIR /app

COPY bun.lock package.json ./
RUN bun install --frozen-lockfile 

FROM node:24-alpine AS builder
WORKDIR /app

ARG COMMIT_HASH
ARG NEXT_PUBLIC_QR_PUBLIC_KEY_HEX
ENV NEXT_PUBLIC_COMMIT_HASH=${COMMIT_HASH}
ENV NEXT_PUBLIC_QR_PUBLIC_KEY_HEX=${NEXT_PUBLIC_QR_PUBLIC_KEY_HEX}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_SHARP_PATH=/app/node_modules/sharp
ENV NEXT_TELEMETRY_DISABLED=1
RUN realpath . 

RUN npm run build

FROM caddy:alpine AS static-server

WORKDIR /srv

COPY --from=builder /app/out /srv

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 3000

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]