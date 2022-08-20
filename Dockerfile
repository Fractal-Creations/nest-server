FROM node:12.13-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod u+x /entrypoint.sh

COPY ./dist ./dist

CMD [ "npm", "run", "start:dev"]
