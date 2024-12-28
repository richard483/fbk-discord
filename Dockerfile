FROM node:22-alpine

LABEL authors="Richard William"

WORKDIR /app

COPY . .

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start-prod" ]