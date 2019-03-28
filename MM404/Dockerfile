FROM python:3.6

RUN apt-get update -y && apt-get install -y gunicorn
RUN pip install gunicorn[eventlet] flask python-socketio flask_socketio redis numpy scipy

RUN mkdir -p /usr/mm/mm404
WORKDIR /usr/mm/mm404

EXPOSE 5000
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "main_mm404:app", "--bind=0.0.0.0:5000", "--no-sendfile"]
