FROM node:24-alpine

COPY package*.json /app/

WORKDIR /app

RUN npm ci

COPY . .

RUN npm run build

ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm" , "run" , "start"]
