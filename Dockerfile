#stage 1
# FROM node:12.16.1-alpine as build
FROM node:17-alpine as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build

#stage 2
FROM nginx:1.19.0
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=build-step /app/dist/logistica-platform /usr/share/nginx/html 
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]