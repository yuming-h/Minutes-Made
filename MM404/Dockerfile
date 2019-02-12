FROM python:3.6

RUN apt-get update -y && apt-get install -y portaudio19-dev
RUN pip install pyaudio flask python-socketio flask_socketio eventlet

ENV FLASK_APP main.py

RUN mkdir -p /usr/mm/mm404
WORKDIR /usr/mm/mm404

EXPOSE 5000