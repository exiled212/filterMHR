FROM node:16 as builder

RUN npm i -g prisma

COPY . /app
WORKDIR /app

RUN npm i
RUN prisma generate

RUN npm run postinstall
RUN npm run build

CMD ["npm", "run", "start"]

