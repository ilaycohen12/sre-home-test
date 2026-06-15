FROM node:20-alpine

RUN apk add --no-cache mysql-client

WORKDIR /app

COPY package.json .
RUN npm install

COPY init.sql .
COPY seed.js .
COPY init.sh .
RUN chmod +x init.sh

ENTRYPOINT ["sh", "init.sh"]
