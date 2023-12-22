FROM node:16 AS build

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:1.20-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html