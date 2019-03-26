FROM ubuntu:18.04

# Install apt-get requirements
RUN apt-get update -qq && apt-get install -y gnupg2 pass docker-compose npm python3 python3-pip

# Install python3 requirements
RUN pip3 install lizard pylint

# Install node requirements
RUN npm install --global prettier

# Install eslint plugins
RUN npm install --global eslint eslint-plugin-import eslint-plugin-react eslint-plugin-flowtype eslint-config-react-app eslint-plugin-jsx-a11y babel-eslint

# Add Jenkins user to the buid pipeline
RUN useradd -u 972 jenkins

# MinutesMade specific items
RUN mkdir -p /MinutesMade
WORKDIR /MinutesMade
