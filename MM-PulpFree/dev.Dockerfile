# Use the base node image
FROM node:8

# Use our docker folder structure
RUN mkdir -p /usr/mm/mm-pulpfree
WORKDIR /usr/mm/mm-pulpfree

# Build NPM dependencies
COPY package*.json ./
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Expose our working port
EXPOSE 8080

# Use this as the start command
CMD ["node", "server"]
