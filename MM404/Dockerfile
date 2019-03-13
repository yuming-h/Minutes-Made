FROM python:3.6

RUN apt-get update -y && apt-get install -y gunicorn
RUN pip install gunicorn[eventlet] flask python-socketio flask_socketio redis numpy scipy

ENV FLASK_APP main.py

RUN mkdir -p /usr/mm/mm404
WORKDIR /usr/mm/mm404

EXPOSE 5000
