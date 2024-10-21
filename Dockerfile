FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --immutable

FROM node:20-alpine
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY src ./src

CMD ["yarn", "start"]
