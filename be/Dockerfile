FROM node:23.11.0-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

FROM base AS build

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile --no-cache

COPY . .  

RUN npx prisma generate

RUN npm run build

FROM base AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules  
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma 

CMD ["node", "dist/main "]
