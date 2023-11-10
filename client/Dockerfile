FROM node:18 AS build
ARG CLIENT_ID

RUN echo 'version 1.1'
WORKDIR /app
COPY package* ./
RUN npm install

COPY public ./public
COPY src ./src
COPY *.config.js ./
COPY tsconfig.json ./
RUN REACT_APP_CLIENT_ID=${CLIENT_ID} \ 
    npm run build


FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html