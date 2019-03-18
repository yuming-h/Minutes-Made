FROM python:3.6

RUN apt-get update -y && apt-get install -y gunicorn
RUN pip install gunicorn[eventlet] flask psycopg2-binary

RUN mkdir -p /usr/mm/mm-koolaid
WORKDIR /usr/mm/mm-koolaid

EXPOSE 5050
