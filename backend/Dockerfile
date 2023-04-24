FROM node:alpine

WORKDIR /backend

COPY ./package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

ENV NODE_ENV production

RUN npx prisma generate

RUN npm run build

CMD ["node", "dist/main"]