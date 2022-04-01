FROM node:16.13-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
COPY . /usr/src/app/

RUN npm install

RUN npm run build

# This is needed for Prisma ORM.
RUN npx prisma generate
COPY . /usr/src/app

EXPOSE 3000

CMD ["npm", "run", "start:dev"]