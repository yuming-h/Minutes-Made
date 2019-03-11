FROM ubuntu:18.04

# Install apt-get requirements
RUN apt-get update -qq && apt-get install -y npm python3 python3-pip

# Install python3 requirements
RUN pip3 install lizard

# Install node requirments
RUN npm install --global prettier

# MinutesMade specific items
RUN mkdir -p /MinutesMade
WORKDIR /MinutesMade
