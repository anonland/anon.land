FROM node:14-alpine as node

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

COPY . .

RUN ./init.sh

CMD ["npm", "start"]