FROM node:20-alpine
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --immutable
COPY src /src/
CMD ["yarn", "start"]
