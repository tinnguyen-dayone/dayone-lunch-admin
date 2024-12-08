FROM node:20.10-bullseye-slim

# Set up pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Create nextjs user/group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create .next directory and set permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy build output
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static 
COPY --chown=nextjs:nodejs public ./public

USER nextjs
EXPOSE 80
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]