FROM node:10

MAINTAINER Andrew Koroluk <koroluka@gmail.com>

WORKDIR /usr/src/app

ENV NODE_PATH=/usr/local/lib/node_modules/:/usr/local/lib  NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production
COPY dist /usr/src/app/

CMD [ "npm", "start" ]
