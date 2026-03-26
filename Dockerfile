# Stage 1: Install dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Stage 2: Build the Next.js app
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Download the exact Chrome build that matches puppeteer-core v24.37.5
FROM node:20-slim AS chrome
WORKDIR /tmp/chrome-dl
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
# Pin @puppeteer/browsers version to avoid install-dir regressions from npx --yes
# pulling the latest. puppeteer-core v24.37.5 bundles @puppeteer/browsers 2.13.0.
RUN npm init -y && npm install @puppeteer/browsers@2.13.0
RUN ./node_modules/.bin/browsers install chrome@stable --install-dir /opt/chrome \
    && ln -s "$(find /opt/chrome -name chrome -type f | head -1)" /opt/chrome/chrome-binary

# Stage 4: Production image
FROM node:20-slim AS runner
WORKDIR /app

# Install only the system libraries Chrome needs (not the full chromium package)
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-noto-color-emoji \
    fonts-noto \
    fonts-noto-cjk \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcups2 \
    libnss3 \
    libxss1 \
    libgtk-3-0 \
    libdrm2 \
    libxshmfence1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the exact Chrome build from the chrome stage
COPY --from=chrome /opt/chrome /opt/chrome

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# Point to the exact Chrome for Testing binary
ENV PUPPETEER_EXECUTABLE_PATH=/opt/chrome/chrome-binary

# Copy standalone output and static/public assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
