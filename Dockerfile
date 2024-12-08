FROM node:20.10-bullseye-slim as base

RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app

# Install dependencies required for sharp
RUN pnpm add -g sharp@0.33.0-rc.2

# Production image
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

# Copy sharp from deps
COPY --from=deps --chown=nextjs:nodejs /usr/local/lib/node_modules/sharp /usr/local/lib/node_modules/sharp

# Create nextjs user/group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create .next directory and set permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy build output and env file
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static 
COPY --chown=nextjs:nodejs public ./public

USER nextjs
EXPOSE 80
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]