# syntax=docker/dockerfile:1

# ---------------------------------------------------------------- base
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
# the prepare script installs the git hooks, which an image has no use for
ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# ---------------------------------------------------------------- deps
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# --------------------------------------------------------------- build
FROM base AS build

# next writes every next_public variable into the pages while it builds them, so these are build arguments and the running container needs none
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_URL
ARG GOOGLE_SITE_VERIFICATION=
# an android build to hand out, fetched from where it was published; left empty, the download band says the build is coming
ARG ANDROID_APK_URL=
ARG ANDROID_APK_VERSION=

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN if [ -n "$ANDROID_APK_URL" ]; then \
      wget -qO /tmp/zeboo.apk "$ANDROID_APK_URL" \
      && node scripts/install-android.mjs /tmp/zeboo.apk --version="$ANDROID_APK_VERSION" \
      && rm /tmp/zeboo.apk; \
    fi

RUN BUILD_STANDALONE=1 pnpm build

# -------------------------------------------------------------- runner
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3003
ENV HOSTNAME=0.0.0.0

WORKDIR /app

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static     ./.next/static
COPY --from=build --chown=node:node /app/public           ./public

USER node

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:3003/robots.txt || exit 1

CMD ["node", "server.js"]
