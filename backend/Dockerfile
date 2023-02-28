FROM prisma:latest

WORKDIR /database

COPY prisma ./prisma/
COPY .env ./

EXPOSE 5432

RUN npx prisma migrate dev --name init
