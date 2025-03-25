# Base image
FROM node:20.17.0-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

FROM base as build

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile  # Cài đặt dependencies

COPY . .  

RUN npm install @prisma/client

RUN npx prisma generate

# Build ứng dụng
RUN npm run build

# Production stage
FROM base AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules  
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma 

CMD ["node", "dist/main"]
