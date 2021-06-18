FROM node:14-alpine as node

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm --prefix ./site install

RUN npm --prefx /site run build

CMD ["npm", "start"]