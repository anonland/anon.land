FROM node:14-alpine as node

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm --prefix ./site install

RUN npm --prefix ./site run build --prod

RUN mkdir site/www/images

RUN mkdir site/www/uploads

EXPOSE 3000
CMD ["npm", "start"]
