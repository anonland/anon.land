FROM node:14-alpine as node

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm --prefix site run build

#nginx
FROM nginx:alpine

COPY --from=node /app/dist/anon.land /usr/share/nginx/html