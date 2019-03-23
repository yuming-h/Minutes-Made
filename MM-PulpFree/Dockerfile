FROM node:8

RUN mkdir -p /usr/mm/mm-pulpfree
WORKDIR /usr/mm/mm-pulpfree

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8080
