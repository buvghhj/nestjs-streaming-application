FROM node:20.17.0-alpine AS build

WORKDIR /app

COPY .prod.env ./.env

COPY package.json package-lock.json ./

RUN npm install -g npm@latest
RUN npm ci --no-cache

COPY . .

RUN npm run dev || echo "GraphQL codegen skipped"

RUN npm run build

FROM node:20.17.0-alpine AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

RUN npm ci --omit=dev 

EXPOSE 3000

CMD ["npm", "run", "start"]
