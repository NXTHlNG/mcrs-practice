FROM node:16-alpine as build-stage

ARG BASIC_AUTH_USER 
ARG BASIC_AUTH_PASSWORD
# FROM tiangolo/node-frontend:10 as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN REACT_APP_BASIC_AUTH_USER=${BASIC_AUTH_USER} \ 
  REACT_APP_BASIC_AUTH_PASSWORD=${BASIC_AUTH_PASSWORD} \ 
  npm run build


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15

COPY --from=build-stage /app/build/ /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/.htpasswd /etc/nginx/.htpasswd