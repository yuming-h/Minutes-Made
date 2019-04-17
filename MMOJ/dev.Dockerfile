# Use the base node image
FROM node:11

# Use our docker folder structure
RUN mkdir -p /usr/mm/mmoj
WORKDIR /usr/mm/mmoj

# Build NPM dependencies
COPY package*.json ./
RUN npm install

# Expose our working port
EXPOSE 3000

# Use this as the start command
CMD ["npm", "run", "dev"]
