FROM node:16.13-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN npm i

RUN npm run build

# This is needed for Prisma ORM.
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:prod"]