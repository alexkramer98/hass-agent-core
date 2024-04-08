FROM node:20
COPY package.json yarn.lock .env tsconfig.json src/ ./
#RUN ls -la && exit 1
RUN yarn install --immutable
CMD ["yarn", "start"]
