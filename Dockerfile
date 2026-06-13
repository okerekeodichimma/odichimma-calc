
FROM node:22-alpine AS ci

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY script.js ./
COPY tests/ ./tests/
COPY jest.config.js ./
COPY .eslintrc.json ./

RUN npx eslint script.js

RUN npx jest --coverage

FROM nginx:alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY index.html  /usr/share/nginx/html/
COPY style.css   /usr/share/nginx/html/
COPY script.js   /usr/share/nginx/html/

EXPOSE 80

# nginx starts automatically — no CMD needed
