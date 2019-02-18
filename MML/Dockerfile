FROM python:3.6

# RUN apt-get update -y && apt-get install -y portaudio19-dev
RUN pip install redis requests speechrecognition

RUN mkdir -p /usr/mm/mml
WORKDIR /usr/mm/mml

EXPOSE 5000
