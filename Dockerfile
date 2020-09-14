FROM node:12

WORKDIR /home/node/app

COPY app/package*.json ./

RUN npm install
RUN npm install -g nodemon