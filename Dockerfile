FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN apt-get update && apt-get install -y wget gnupg

RUN wget -qO - https://www.rabbitmq.com/rabbitmq-signing-key-public.asc | apt-key add -

RUN echo "deb http://www.rabbitmq.com/debian/ testing main" | tee /etc/apt/sources.list.d/rabbitmq.list

RUN apt-get update && apt-get install -y rabbitmq-server

EXPOSE 5672

CMD [ "npm", "run", "dev" ]