ARG NODE_VERSION=24.13.0

# ----------- Building stage
FROM node:${NODE_VERSION}-alpine as builder
# Needed because npm run build substitutes environemnt variables at build stage
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# Additional dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Copy package and package-lock
COPY package*.json ./
# Install all libraries to build the project 
RUN npm ci
COPY . .
# Build the project
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build 

# ----------- Runtime stage
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Expose the port that the application listens on.
EXPOSE 5173
# Run the application.
ENV HOSTNAME=0.0.0.0
ENV PORT=5173
CMD ["node", "server.js"]
