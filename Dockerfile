FROM node:10

MAINTAINER Andrew Koroluk <koroluka@gmail.com>

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production
COPY dist /usr/src/app/

CMD [ "node", "server" ]
