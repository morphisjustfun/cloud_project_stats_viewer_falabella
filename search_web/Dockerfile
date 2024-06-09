FROM node:18-alpine AS build

ENV NODE_OPTIONS="--openssl-legacy-provider"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:alpine3.19-slim
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]