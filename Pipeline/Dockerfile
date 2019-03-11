from ubuntu:18.04

# Install apt-get requirements
RUN apt-get update -qq && apt-get install python3

# Install python3 requirements
RUN pip3 install lizard

# MinutesMade specific items
RUN mkdir -p /MinutesMade
WORKDIR MinutesMade
