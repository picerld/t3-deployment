# ----------------------
# Builder stage
# ----------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install bash (needed by scripts like wait-for-it)
RUN apk add --no-cache bash

# Copy dependency files
COPY package.json package-lock.json ./

# Copy Prisma schema early (needed for postinstall)
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ----------------------
# Runner stage
# ----------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Install bash (needed by scripts like wait-for-it)
RUN apk add --no-cache bash

ENV NODE_ENV=development

# Copy only required files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Copy wait-for-it script and make it executable
COPY wait-for-it.sh /wait-for-it.sh
RUN sed -i 's/\r$//' /wait-for-it.sh && chmod +x /wait-for-it.sh

EXPOSE 3101

# Use wait-for-it as ENTRYPOINT
ENTRYPOINT ["/wait-for-it.sh", "db:5433", "--"]

# Default command to run after wait-for-it
CMD ["npm", "run", "dev", "--", "--port", "3101"]