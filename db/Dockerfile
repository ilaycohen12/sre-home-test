FROM node:20-alpine

RUN apk add --no-cache mysql-client dos2unix

WORKDIR /app

COPY package.json .
RUN npm install

COPY init.sql .
COPY seed.js .
COPY init.sh .
RUN dos2unix init.sh && chmod +x init.sh

ENTRYPOINT ["sh", "init.sh"]
